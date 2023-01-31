import { Octokit } from '@octokit/core';

export function initClient(token: string) {
  return new Octokit({ auth: token });
}

function dec2hex (dec: number) {
  return dec.toString(16).padStart(2, "0")
}

function generateId (len?: number) {
  const arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

export function startAuth() {
  const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
  const OAUTH_SCOPE = 'public_repo';
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID as string | undefined;
  if (!clientId) {
    throw new Error('VITE_OAUTH_CLIENT_ID is not defined, check your .env file');
  }
  const random_id = generateId();
  sessionStorage.setItem('github-oauth-state', random_id)
  // Redirect to github to start oAuth process
  console.log(GITHUB_OAUTH_URL  + new URLSearchParams({
    client_id: clientId,
    scope: OAUTH_SCOPE,
    state: random_id,
  }))
  window.location.href = GITHUB_OAUTH_URL + '?' + new URLSearchParams({
    client_id: clientId,
    scope: OAUTH_SCOPE,
    state: random_id,
  })
}

export async function getAuthenticatedUser(client: Octokit) {
  const data = await client.request('GET /user');
  return data;
}