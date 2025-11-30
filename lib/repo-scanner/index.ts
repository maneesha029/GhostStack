export interface ApiEndpoint {
  method: string
  path: string
  params?: string[]
  queryParams?: string[]
  bodySchema?: Record<string, any>
  responseSchema?: Record<string, any>
}

export interface ScannedRepo {
  endpoints: ApiEndpoint[]
  interfaces: Array<{ name: string; definition: string }>
  fetchCalls: Array<{ url: string; method: string; body?: any }>
  axiosCalls: Array<{ url: string; method: string; body?: any }>
  // New fields for enhanced analysis
  repoMetadata?: {
    name: string
    description: string
    languages: Record<string, number>
    stars: number
    forks: number
    watchers: number
    contributors: number
    isActive: boolean
  }
}


export async function scanRepository(
  repoUrl: string | File
): Promise<ScannedRepo> {
  // Basic implementation that fetches a public GitHub repository's file tree
  // and extracts simple patterns (fetch/axios calls and TypeScript interfaces).
  if (typeof repoUrl !== 'string') {
    throw new Error('File-based scanning is not implemented in this environment')
  }

  // Normalize URL and strip trailing .git or slashes
  const cleanedUrl = repoUrl.replace(/\.git$/i, '').replace(/\/+$/i, '')

  // Try to parse GitHub repo URL: https://github.com/owner/repo or with tree/branch
  const ghMatch = cleanedUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/) || []
  const owner = ghMatch[1]
  const repo = ghMatch[2]
  let branch = ghMatch[3] || ''

  if (!owner || !repo) {
    throw new Error('Only GitHub repository URLs are supported (owner/repo)')
  }

  // Attach auth header when GITHUB_TOKEN is provided (helps private repos & rate limits)
  const githubToken = process.env.GITHUB_TOKEN || process.env.NPM_CONFIG_GITHUB_TOKEN

  async function fetchJson(url: string) {
    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
    if (githubToken) headers.Authorization = `Bearer ${githubToken}`
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`GitHub API error ${res.status} for ${url}`)
    return res.json()
  }

  // Fetch repo metadata (name, description, stars, forks, etc.)
  let repoMetadata: any = null
  try {
    repoMetadata = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`)
  } catch (err) {
    console.warn('Failed to fetch repo metadata:', err)
  }

  // Determine branch: if not provided, use repo default_branch
  if (!branch && repoMetadata?.default_branch) {
    branch = repoMetadata.default_branch
  } else if (!branch) {
    branch = 'main'
  }

  // Fetch languages used in repo
  let languages: Record<string, number> = {}
  try {
    languages = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/languages`)
  } catch (err) {
    console.warn('Failed to fetch languages:', err)
  }

  // Fetch commit activity (check if repo is active)
  let isActive = true
  try {
    const commits = await fetchJson(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
    )
    const lastCommitDate = commits[0]?.commit?.author?.date
    if (lastCommitDate) {
      const daysSinceLastCommit = Math.floor(
        (Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      isActive = daysSinceLastCommit < 365 // Consider active if commit within last year
    }
  } catch (err) {
    console.warn('Failed to fetch commit activity:', err)
  }

  // Get repo tree (recursive). Try branch, fall back to master.
  let treeJson: any
  try {
    treeJson = await fetchJson(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    )
    if (!treeJson.tree) throw new Error('No tree returned')
  } catch (err) {
    if (branch !== 'master') {
      branch = 'master'
      treeJson = await fetchJson(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      )
    } else {
      throw err
    }
  }

  const files = (treeJson.tree || []).filter((f: any) => f.type === 'blob')

  const codeFiles = files
    .map((f: any) => f.path)
    .filter((p: string) => /\.(js|ts|tsx|jsx|mjs|cjs|py|java|go|rb|php|swift|kotlin)$/.test(p))

  // Limit how many files we download to avoid long-running scans
  const maxFiles = 50
  const selected = codeFiles.slice(0, maxFiles)

  const fetchCalls: Array<{ url: string; method: string; file?: string }> = []
  const axiosCalls: Array<{ url: string; method: string; file?: string }> = []
  const interfaces: Array<{ name: string; definition: string }> = []

  const fetchRegex = /fetch\(\s*['"`]([^'"`]+)['"`]\s*(?:,\s*\{([\s\S]+?)\})?/g
  const axiosRegex = /axios\.(get|post|put|delete|patch)\(\s*['"`]([^'"`]+)['"`]/g
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)\s*\{([\s\S]*?)\n\}/g

  for (const path of selected) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
      const rawHeaders: Record<string, string> = {}
      if (githubToken) rawHeaders.Authorization = `Bearer ${githubToken}`
      const res = await fetch(rawUrl, { headers: rawHeaders })
      if (!res.ok) continue
      const text = await res.text()

      let m: RegExpExecArray | null
      fetchRegex.lastIndex = 0
      while ((m = fetchRegex.exec(text))) {
        const url = m[1]
        const opts = m[2]
        let method = 'GET'
        if (opts) {
          const methodMatch = opts.match(/method\s*:\s*['\"]?(\w+)['\"]?/i)
          if (methodMatch) method = methodMatch[1].toUpperCase()
        }
        fetchCalls.push({ url, method, file: path })
      }

      axiosRegex.lastIndex = 0
      while ((m = axiosRegex.exec(text))) {
        const methodFound = (m[1] || 'get').toUpperCase()
        const url = m[2]
        axiosCalls.push({ url, method: methodFound, file: path })
      }

      interfaceRegex.lastIndex = 0
      while ((m = interfaceRegex.exec(text))) {
        const name = m[1]
        const body = m[2]
        interfaces.push({ name, definition: `interface ${name} {${body}\n}` })
      }
    } catch (e) {
      // ignore file errors and continue
      continue
    }
  }

  // Infer endpoints from collected calls
  const endpointMap = new Map<string, ApiEndpoint>()

  function normalizePath(u: string) {
    try {
      if (/^https?:\/\//.test(u)) {
        const parsed = new URL(u)
        return parsed.pathname + (parsed.search || '')
      }
    } catch (e) {
      // ignore
    }
    return u
  }

  for (const c of [...fetchCalls, ...axiosCalls]) {
    const p = normalizePath(c.url)
    const key = `${c.method} ${p}`
    if (!endpointMap.has(key)) {
      endpointMap.set(key, { method: c.method, path: p })
    }
  }

  const endpoints = Array.from(endpointMap.values())

  return {
    endpoints,
    interfaces,
    fetchCalls: fetchCalls.map(({ url, method, file }) => ({ url, method, body: undefined })),
    axiosCalls: axiosCalls.map(({ url, method, file }) => ({ url, method, body: undefined })),
    repoMetadata: repoMetadata
      ? {
          name: repoMetadata.name,
          description: repoMetadata.description || '',
          languages,
          stars: repoMetadata.stargazers_count || 0,
          forks: repoMetadata.forks_count || 0,
          watchers: repoMetadata.watchers_count || 0,
          contributors: repoMetadata.network_count || 0,
          isActive,
        }
      : undefined,
  }
}

