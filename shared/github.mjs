/**
 * Minimal GitHub client for committing edited deck files.
 *
 * Uses the git data API rather than the contents API so that a save touching
 * both `slides.tsx` and `deck.yaml` lands as one commit — and therefore one
 * deploy — instead of two.
 */
export function createGitHubClient({ token, repo, branch = 'main', apiBase = 'https://api.github.com' }) {
  if (!token) throw new Error('GITHUB_TOKEN is not configured')
  if (!repo) throw new Error('GITHUB_REPO is not configured')

  const call = async (endpoint, init = {}) => {
    const response = await fetch(`${apiBase}/repos/${repo}${endpoint}`, {
      ...init,
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'content-type': 'application/json',
        'user-agent': 'presentations-web-editor',
        ...init.headers
      }
    })

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`GitHub ${init.method ?? 'GET'} ${endpoint} failed (${response.status}): ${detail.slice(0, 200)}`)
    }

    return response.json()
  }

  return {
    async readFiles(paths) {
      const contents = {}
      for (const filePath of paths) {
        const file = await call(`/contents/${encodeURI(filePath)}?ref=${encodeURIComponent(branch)}`)
        contents[filePath] = decodeBase64(file.content)
      }
      return contents
    },

    /** Commits `files` (path -> new content) on top of the current branch head. */
    async commitFiles(files, message) {
      const head = await call(`/git/ref/heads/${encodeURIComponent(branch)}`)
      const parent = head.object.sha

      const tree = []
      for (const [filePath, content] of Object.entries(files)) {
        const blob = await call('/git/blobs', {
          method: 'POST',
          body: JSON.stringify({ content, encoding: 'utf-8' })
        })
        tree.push({ path: filePath, mode: '100644', type: 'blob', sha: blob.sha })
      }

      const newTree = await call('/git/trees', {
        method: 'POST',
        body: JSON.stringify({ base_tree: parent, tree })
      })
      const commit = await call('/git/commits', {
        method: 'POST',
        body: JSON.stringify({ message, tree: newTree.sha, parents: [parent] })
      })

      // No force: if the branch moved while we were building the commit, this
      // fails instead of dropping whatever landed in between.
      await call(`/git/refs/heads/${encodeURIComponent(branch)}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha, force: false })
      })

      return { sha: commit.sha, shortSha: commit.sha.slice(0, 7), branch }
    }
  }
}

function decodeBase64(value) {
  const binary = atob(value.replace(/\n/g, ''))
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)))
}
