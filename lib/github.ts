const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG || "";

const BASE_URL = GITHUB_ORG 
  ? `https://api.github.com/orgs/${GITHUB_ORG}`
  : "https://api.github.com";

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  created_at: string;
  user: { login: string; avatar_url: string };
}

interface GitHubPR {
  number: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  user: { login: string };
  head: { ref: string; sha: string };
  base: { ref: string };
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  default_branch: string;
}

async function fetchGitHub(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }
  
  return res.json();
}

export async function createIssue(repo: string, title: string, body: string): Promise<GitHubIssue> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body }),
  });
}

export async function listIssues(repo: string, state: "open" | "closed" | "all" = "open"): Promise<GitHubIssue[]> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/issues?state=${state}`);
}

export async function getIssue(repo: string, issueNumber: number): Promise<GitHubIssue> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/issues/${issueNumber}`);
}

export async function updateIssue(repo: string, issueNumber: number, updates: { title?: string; body?: string; state?: string }): Promise<GitHubIssue> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function listPullRequests(repo: string, state: "open" | "closed" | "all" = "open"): Promise<GitHubPR[]> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/pulls?state=${state}`);
}

export async function getPullRequest(repo: string, prNumber: number): Promise<GitHubPR> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/pulls/${prNumber}`);
}

export async function createPullRequest(
  repo: string, 
  title: string, 
  body: string, 
  head: string, 
  base: string
): Promise<GitHubPR> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, body, head, base }),
  });
}

export async function reviewPullRequest(
  repo: string, 
  prNumber: number, 
  body: string, 
  event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT" = "COMMENT"
): Promise<void> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  await fetchGitHub(`/repos/${repo}/pulls/${prNumber}/reviews`, {
    method: "POST",
    body: JSON.stringify({ body, event }),
  });
}

export async function getRepository(repo: string): Promise<GitHubRepo> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}`);
}

export async function listCommits(repo: string, limit: number = 10): Promise<{ sha: string; commit: { message: string }; author: { login: string } }[]> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/repos/${repo}/commits?per_page=${limit}`);
}

export async function getFileContent(repo: string, path: string, ref?: string): Promise<{ content: string; encoding: string }> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  const endpoint = ref 
    ? `/repos/${repo}/contents/${path}?ref=${ref}`
    : `/repos/${repo}/contents/${path}`;
  
  return fetchGitHub(endpoint);
}

export async function searchRepositories(query: string, limit: number = 10): Promise<{ items: GitHubRepo[] }> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  return fetchGitHub(`/search/repositories?q=${encodeURIComponent(query)}&per_page=${limit}`);
}

interface SearchCodeResult {
  items: { path: string; repository: { full_name: string }; matches: { fragment: string }[] }[];
}

export async function searchCode(query: string, repo?: string, limit: number = 10): Promise<SearchCodeResult> {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  
  let q = query;
  if (repo) q += ` repo:${repo}`;
  
  return fetchGitHub(`/search/code?q=${encodeURIComponent(q)}&per_page=${limit}`);
}

// Parser untuk command string
export function parseGitHubCommand(text: string): { action: string; args: string[] } | null {
  const parts = text.trim().toLowerCase().split(/\s+/);
  const cmd = parts[0];
  
  if (cmd === "/github") {
    const action = parts[1];
    const args = parts.slice(2);
    return { action, args };
  }
  
  return null;
}