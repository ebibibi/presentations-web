/**
 * Commit and push the files an editor save just wrote.
 *
 * Dev-server side of "save and it is live": the working tree may hold unrelated
 * edits (other agents, other decks), so every git call is restricted to the
 * paths that were actually patched.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)

async function git(repoRoot, args, timeout = 15_000) {
  try {
    const { stdout } = await run('git', args, { cwd: repoRoot, timeout })
    return stdout.trim()
  } catch (error) {
    const detail = (error.stderr || error.stdout || error.message || '').trim()
    // git puts the reason first and pages of hints after it; keep both, but
    // surface only the reason.
    const reason = detail
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('hint:'))
      .slice(0, 2)
      .join(' ')
    const failure = new Error(reason || 'git command failed')
    failure.detail = detail
    throw failure
  }
}

/**
 * Commits `files` (repo-relative) and pushes the current branch.
 * Returns what happened so the UI can say where the change went.
 */
export async function publishFiles(repoRoot, files, message) {
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

  const hasUpstream = await git(repoRoot, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])
    .then(() => true)
    .catch(() => false)

  const push = () => git(repoRoot, hasUpstream ? ['push'] : ['push', '-u', 'origin', 'HEAD'], 90_000)

  try {
    await push()
  } catch (error) {
    const rebased = await rebaseOnRemote(repoRoot, branch)
    if (!rebased) {
      throw new Error(
        `${commit} としてコミット済みですが、push できませんでした（${describePushFailure(error)}）`
      )
    }
    await push()
    return { branch, commit: await git(repoRoot, ['rev-parse', '--short', 'HEAD']), committed: true, pushed: true, rebased: true }
  }

  return { branch, commit, committed: true, pushed: true }
}

function describePushFailure(error) {
  const message = error instanceof Error ? `${error.message} ${error.detail ?? ''}` : String(error)
  if (/non-fast-forward|fetch first|rejected/.test(message)) {
    return 'リモートが進んでいます。ターミナルで git pull してください'
  }
  return message.slice(0, 160)
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
