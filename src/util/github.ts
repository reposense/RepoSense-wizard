import { Octokit } from '@octokit/core';

export function initClient(token: string) {
  return new Octokit({ auth: token });
}

function dec2hex(dec: number) {
  return dec.toString(16).padStart(2, '0');
}

// Generates a random string for use as the 'state' when starting oAuth
// See https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
function generateId(len?: number) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

export function startAuth() {
  const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
  const OAUTH_SCOPE = 'public_repo';
  const CALLBACK_URL_DEV = import.meta.env.VITE_CALLBACK_URL_DEV as string;
  const CALLBACK_URL_PROD = import.meta.env.VITE_CALLBACK_URL_PROD as string;
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID as string | undefined;
  if (!clientId) {
    throw new Error('VITE_OAUTH_CLIENT_ID is not defined, check your .env file');
  }
  const randomId = generateId();
  sessionStorage.setItem('github-oauth-state', randomId);
  // Redirect to github to start oAuth process
  window.location.href = `${GITHUB_OAUTH_URL}?${new URLSearchParams({
    client_id: clientId,
    scope: OAUTH_SCOPE,
    state: randomId,
    redirect_uri: import.meta.env.PROD ? CALLBACK_URL_PROD : CALLBACK_URL_DEV,
  })}`;
}

export async function getAuthenticatedUser(client: Octokit) {
  const data = await client.request('GET /user');
  return data;
}
