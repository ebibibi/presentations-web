import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  classifyPushFailure,
  describePushFailure,
  editorBranchName,
  publishFiles
} from './deck-git.mjs'

const RULE_REJECTION = `remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Changes must be made through a pull request.
To github.com:owner/repo.git
 ! [remote rejected] main -> main (push declined due to repository rule violations)
error: failed to push some refs to 'github.com:owner/repo.git'`

const BEHIND_REJECTION = `To github.com:owner/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:owner/repo.git'
hint: Updates were rejected because the remote contains work that you do not have locally.`

const NON_FF_REJECTION = ` ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'origin'`

function gitError(detail) {
  const error = new Error(detail.split('\n')[0])
  error.detail = detail
  return error
}

test('a ruleset rejection is not mistaken for a remote that moved ahead', () => {
  assert.equal(classifyPushFailure(gitError(RULE_REJECTION)), 'rule')
  assert.match(describePushFailure(gitError(RULE_REJECTION)), /ルール/)
  assert.doesNotMatch(describePushFailure(gitError(RULE_REJECTION)), /git pull/)
})

test('fetch-first and non-fast-forward rejections still ask for a pull', () => {
  assert.equal(classifyPushFailure(gitError(BEHIND_REJECTION)), 'behind')
  assert.equal(classifyPushFailure(gitError(NON_FF_REJECTION)), 'behind')
  assert.match(describePushFailure(gitError(NON_FF_REJECTION)), /git pull/)
})

test('other failures pass the reason through', () => {
  const error = gitError('fatal: could not read Username for https://github.com')
  assert.equal(classifyPushFailure(error), 'other')
  assert.match(describePushFailure(error), /could not read Username/)
})

test('editor branch names are unique per commit and valid refs', () => {
  const name = editorBranchName('abc1234', new Date('2026-11-21T05:06:07.890Z'))
  assert.equal(name, 'deck-editor/20261121-050607-abc1234')
  execFileSync('git', ['check-ref-format', `refs/heads/${name}`])
})

/** A remote that, like the GitHub ruleset, refuses direct pushes to main. */
function setupRepos() {
  const root = mkdtempSync(path.join(tmpdir(), 'deck-git-'))
  const remote = path.join(root, 'remote.git')
  const work = path.join(root, 'work')
  const sh = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()

  execFileSync('git', ['init', '--bare', '-b', 'main', remote])
  execFileSync('git', ['clone', remote, work], { stdio: 'ignore' })
  sh(work, 'config', 'user.email', 'test@example.com')
  sh(work, 'config', 'user.name', 'Test')
  sh(work, 'checkout', '-b', 'main')
  writeFileSync(path.join(work, 'deck.yaml'), 'title: one\n')
  writeFileSync(path.join(work, 'other.txt'), 'untouched\n')
  sh(work, 'add', '.')
  sh(work, 'commit', '-m', 'init')
  sh(work, 'push', '-u', 'origin', 'main')

  const hook = path.join(remote, 'hooks', 'pre-receive')
  writeFileSync(
    hook,
    `#!/bin/sh
while read old new ref; do
  if [ "$ref" = "refs/heads/main" ]; then
    echo "error: GH013: Repository rule violations found for refs/heads/main." >&2
    exit 1
  fi
done
`
  )
  chmodSync(hook, 0o755)

  const ghLog = path.join(root, 'gh.log')
  const fakeGh = path.join(root, 'gh')
  writeFileSync(
    fakeGh,
    `#!/bin/sh
printf '%s\\n' "$*" >> "${ghLog}"
case "$1 $2" in
  "issue create") echo "https://github.com/owner/repo/issues/41" ;;
  "pr create") echo "Warning: 1 uncommitted change"; echo "https://github.com/owner/repo/pull/42" ;;
  "pr merge") [ -n "$GH_FAIL_MERGE" ] && { echo "auto-merge is not allowed" >&2; exit 1; } ;;
esac
exit 0
`
  )
  chmodSync(fakeGh, 0o755)

  return { remote, work, sh, ghLog, fakeGh }
}

test('a save on main is published through issue + PR + auto-merge, not pushed to main', async () => {
  const { remote, work, sh, ghLog, fakeGh } = setupRepos()
  writeFileSync(path.join(work, 'deck.yaml'), 'title: two\n')
  writeFileSync(path.join(work, 'other.txt'), 'someone else is editing\n')

  const result = await publishFiles(work, ['deck.yaml'], 'fix(copy): update slide text in demo', {
    gh: fakeGh,
    now: () => new Date('2026-11-21T05:06:07Z')
  })

  const head = sh(work, 'rev-parse', '--short', 'HEAD')
  assert.equal(result.branch, `deck-editor/20261121-050607-${head}`)
  assert.equal(result.base, 'main')
  assert.equal(result.pushed, true)
  assert.equal(result.autoMerge, true)
  assert.deepEqual(result.issue, { number: 41, url: 'https://github.com/owner/repo/issues/41' })
  assert.deepEqual(result.pullRequest, { number: 42, url: 'https://github.com/owner/repo/pull/42' })

  // The remote main is untouched; the commit lives on the publishing branch.
  assert.notEqual(sh(remote, 'rev-parse', '--short', 'main'), head)
  assert.equal(sh(remote, 'rev-parse', '--short', result.branch), head)
  // The checkout stays on main and the unrelated edit is neither committed nor lost.
  assert.equal(sh(work, 'rev-parse', '--abbrev-ref', 'HEAD'), 'main')
  assert.equal(readFileSync(path.join(work, 'other.txt'), 'utf8'), 'someone else is editing\n')
  assert.match(sh(work, 'status', '--porcelain'), /other\.txt/)

  const calls = readFileSync(ghLog, 'utf8')
  assert.match(calls, /^issue create --title fix\(copy\): update slide text in demo/m)
  assert.match(calls, /^pr create --base main --head deck-editor\/\S+ --title .* --body Closes #41/m)
  assert.match(calls, /^pr merge https:\/\/github\.com\/owner\/repo\/pull\/42 --auto --merge$/m)
})

test('the PR is still reported when auto-merge cannot be enabled', async () => {
  const { work, fakeGh } = setupRepos()
  writeFileSync(path.join(work, 'deck.yaml'), 'title: three\n')
  process.env.GH_FAIL_MERGE = '1'
  try {
    const result = await publishFiles(work, ['deck.yaml'], 'fix(copy): x', { gh: fakeGh })
    assert.equal(result.autoMerge, false)
    assert.equal(result.pullRequest.number, 42)
    assert.match(result.autoMergeError, /auto-merge is not allowed/)
  } finally {
    delete process.env.GH_FAIL_MERGE
  }
})

test('nothing to commit means nothing is published', async () => {
  const { work, ghLog, fakeGh } = setupRepos()
  const result = await publishFiles(work, ['deck.yaml'], 'noop', { gh: fakeGh })
  assert.deepEqual(result, { branch: 'main', committed: false, pushed: false })
  assert.throws(() => readFileSync(ghLog, 'utf8'))
})

test('a feature branch is pushed directly, and a rule rejection there is reported as such', async () => {
  const { remote, work, sh, ghLog, fakeGh } = setupRepos()
  sh(work, 'checkout', '-b', 'feature')
  writeFileSync(path.join(work, 'deck.yaml'), 'title: four\n')

  const pushed = await publishFiles(work, ['deck.yaml'], 'fix(copy): feature', { gh: fakeGh })
  assert.equal(pushed.branch, 'feature')
  assert.equal(pushed.pushed, true)
  assert.equal(sh(remote, 'rev-parse', '--short', 'feature'), pushed.commit)
  assert.throws(() => readFileSync(ghLog, 'utf8'))

  // Treat main as some other branch: the remote rule now rejects the push, and
  // the message must not tell the user to pull.
  sh(work, 'checkout', 'main')
  writeFileSync(path.join(work, 'deck.yaml'), 'title: five\n')
  await assert.rejects(
    publishFiles(work, ['deck.yaml'], 'fix(copy): blocked', { gh: fakeGh, defaultBranch: 'trunk' }),
    (error) => {
      assert.match(error.message, /コミット済み/)
      assert.match(error.message, /ルール/)
      assert.doesNotMatch(error.message, /git pull/)
      return true
    }
  )
})
