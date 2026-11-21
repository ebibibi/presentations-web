/**
 * Commit and publish the files an editor save just wrote.
 *
 * Dev-server side of "save and it is live": the working tree may hold unrelated
 * edits (other agents, other decks), so every git call is restricted to the
 * paths that were actually patched.
 *
 * The default branch only accepts changes through a pull request that closes an
 * issue (repository ruleset), so a save on it never pushes it directly: the
 * commit is pushed to a fresh branch, an issue and a pull request are opened
 * with `gh`, and auto-merge is switched on. Any other branch is pushed as is.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)

/** Prefix of the branches a save on the default branch is published through. */
export const EDITOR_BRANCH_PREFIX = 'deck-editor/'

function commandError(error, fallback) {
  const detail = (error.stderr || error.stdout || error.message || '').trim()
  // git puts the reason first and pages of hints after it; keep both, but
  // surface only the reason.
  const reason = detail
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('hint:'))
    .slice(0, 2)
    .join(' ')
  const failure = new Error(reason || fallback)
  failure.detail = detail
  return failure
}

async function git(repoRoot, args, timeout = 15_000) {
  try {
    const { stdout } = await run('git', args, { cwd: repoRoot, timeout })
    return stdout.trim()
  } catch (error) {
    throw commandError(error, 'git command failed')
  }
}

async function gh(repoRoot, bin, args, timeout = 60_000) {
  try {
    const { stdout } = await run(bin, args, { cwd: repoRoot, timeout })
    return stdout.trim()
  } catch (error) {
    throw commandError(error, 'gh command failed')
  }
}

/**
 * Commits `files` (repo-relative) and publishes them.
 * Returns what happened so the UI can say where the change went.
 *
 * Options (tests inject these; the dev server uses the defaults):
 * - `defaultBranch`: branch guarded by the ruleset; detected from `origin/HEAD`.
 * - `gh`: the GitHub CLI executable.
 * - `now`: clock used to name the publishing branch.
 */
export async function publishFiles(repoRoot, files, message, options = {}) {
  const branch = await git(repoRoot, ['rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch === 'HEAD') {
    throw new Error('ブランチがdetached HEADなので公開できません')
  }

  const pending = await git(repoRoot, ['status', '--porcelain', '--', ...files])
  if (!pending) {
    return { branch, committed: false, pushed: false }
  }

  // Pathspec form: commits the working tree state of these files only, so a
  // concurrent edit elsewhere in the repo cannot ride along.
  await git(repoRoot, ['commit', '-m', message, '--', ...files])
  const commit = await git(repoRoot, ['rev-parse', '--short', 'HEAD'])

  const defaultBranch = options.defaultBranch ?? (await detectDefaultBranch(repoRoot))
  if (branch === defaultBranch) {
    return publishThroughPullRequest(repoRoot, { files, message, commit, defaultBranch, options })
  }

  return pushBranch(repoRoot, branch, commit)
}

async function pushBranch(repoRoot, branch, commit) {
  const hasUpstream = await git(repoRoot, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])
    .then(() => true)
    .catch(() => false)

  const push = () => git(repoRoot, hasUpstream ? ['push'] : ['push', '-u', 'origin', 'HEAD'], 90_000)

  try {
    await push()
  } catch (error) {
    // Rebasing cannot get past a repository rule, so only a remote that moved
    // ahead is worth a retry.
    const rebased = classifyPushFailure(error) === 'behind' && (await rebaseOnRemote(repoRoot, branch))
    if (!rebased) {
      throw new Error(`${commit} としてコミット済みですが、push できませんでした（${describePushFailure(error)}）`)
    }
    await push()
    return { branch, commit: await git(repoRoot, ['rev-parse', '--short', 'HEAD']), committed: true, pushed: true, rebased: true }
  }

  return { branch, commit, committed: true, pushed: true }
}

/**
 * Publishes HEAD of the default branch through issue + pull request + auto-merge.
 *
 * The checkout is never switched: HEAD is pushed to a new remote branch, so
 * unrelated uncommitted work in the tree is untouched. The pull request is
 * merged with a merge commit, which keeps the local commit an ancestor of the
 * remote default branch and lets a later `git pull` fast-forward.
 */
async function publishThroughPullRequest(repoRoot, { files, message, commit, defaultBranch, options }) {
  const ghBin = options.gh ?? 'gh'
  const publishBranch = editorBranchName(commit, options.now?.() ?? new Date())

  try {
    await git(repoRoot, ['push', 'origin', `HEAD:refs/heads/${publishBranch}`], 90_000)
  } catch (error) {
    throw new Error(`${commit} としてコミット済みですが、push できませんでした（${describePushFailure(error)}）`)
  }

  const fileList = files.map((file) => `- \`${file}\``).join('\n')
  let issueUrl
  let prUrl
  try {
    issueUrl = lastUrl(
      await gh(repoRoot, ghBin, [
        'issue', 'create',
        '--title', message,
        '--body', `Saved from the deck editor (commit ${commit}).\n\nFiles:\n${fileList}`
      ])
    )
    const issueNumber = numberFromUrl(issueUrl)
    prUrl = lastUrl(
      await gh(repoRoot, ghBin, [
        'pr', 'create',
        '--base', defaultBranch,
        '--head', publishBranch,
        '--title', message,
        '--body', `Closes #${issueNumber}\n\nSaved from the deck editor.\n\nFiles:\n${fileList}`
      ])
    )
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(
      `${commit} を ${publishBranch} に push しましたが、${prUrl ? '' : issueUrl ? 'PR' : 'Issue'}の作成に失敗しました（${reason.slice(0, 160)}）`
    )
  }

  const pullRequest = { number: numberFromUrl(prUrl), url: prUrl }
  const issue = { number: numberFromUrl(issueUrl), url: issueUrl }

  let autoMerge = true
  let autoMergeError
  try {
    await gh(repoRoot, ghBin, ['pr', 'merge', prUrl, '--auto', '--merge'])
  } catch (error) {
    autoMerge = false
    autoMergeError = (error instanceof Error ? error.message : String(error)).slice(0, 160)
  }

  return {
    branch: publishBranch,
    base: defaultBranch,
    commit,
    committed: true,
    pushed: true,
    issue,
    pullRequest,
    autoMerge,
    ...(autoMergeError ? { autoMergeError } : {})
  }
}

export function editorBranchName(commit, now) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\..*$/, '').replace('T', '-')
  return `${EDITOR_BRANCH_PREFIX}${stamp}-${commit}`
}

async function detectDefaultBranch(repoRoot) {
  const ref = await git(repoRoot, ['symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD']).catch(() => '')
  return ref.replace(/^origin\//, '') || 'main'
}

function lastUrl(output) {
  const url = output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^https?:\/\//.test(line))
    .pop()
  if (!url) throw new Error(`URL が返りませんでした: ${output.slice(0, 120)}`)
  return url
}

function numberFromUrl(url) {
  const match = /\/(\d+)\/?$/.exec(url)
  if (!match) throw new Error(`番号を読み取れません: ${url}`)
  return Number(match[1])
}

/**
 * Why git refused a push:
 * - `rule`: a branch protection / repository ruleset declined it; pulling will not help.
 * - `behind`: the remote has commits the local branch lacks.
 * - `other`: anything else (auth, network, ...).
 */
export function classifyPushFailure(error) {
  const message = error instanceof Error ? `${error.message} ${error.detail ?? ''}` : String(error)
  if (/repository rule violations|GH013|GH006|protected branch|push declined/i.test(message)) {
    return 'rule'
  }
  if (/non-fast-forward|fetch first|\(behind\)|tip of your current branch is behind/i.test(message)) {
    return 'behind'
  }
  return 'other'
}

export function describePushFailure(error) {
  switch (classifyPushFailure(error)) {
    case 'rule':
      return 'リポジトリのルールでこのブランチへの直接 push は禁止されています。Issue に紐付いた PR を経由してください'
    case 'behind':
      return 'リモートが進んでいます。ターミナルで git pull してください'
    default: {
      const message = error instanceof Error ? error.message : String(error)
      return message.slice(0, 160)
    }
  }
}

/**
 * Catches up with the remote after a rejected push — but only when nothing else
 * is uncommitted, because rebasing would otherwise need to stash work that
 * belongs to someone else (another agent editing the same checkout).
 */
async function rebaseOnRemote(repoRoot, branch) {
  const dirty = await git(repoRoot, ['status', '--porcelain'])
  if (dirty) return false

  try {
    await git(repoRoot, ['fetch', 'origin', branch], 60_000)
    await git(repoRoot, ['rebase', `origin/${branch}`], 60_000)
    return true
  } catch {
    await git(repoRoot, ['rebase', '--abort']).catch(() => {})
    return false
  }
}
