import { Octokit } from '@octokit/core';

export function initClient(token: string) {
  return new Octokit({ auth: token });
}

function dec2hex(dec: number) {
  return dec.toString(16).padStart(2, '0');
}

// Generates a random string for use as the 'state' when starting oAuth
// https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
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

export async function forkRepoSense(client: Octokit) {
  const data = await client.request('POST /repos/reposense/publish-RepoSense/forks');
  return data;
}

export async function enableActions(client: Octokit, owner: string, repo: string) {
  const data = await client.request('PUT /repos/{owner}/{repo}/actions/permissions', {
    owner,
    repo,
    enabled: true,
    allowed_actions: 'all',
  });
  return data;
}

export async function listWorkflows(client: Octokit, owner: string, repo: string) {
  const data = await client.request('GET /repos/{owner}/{repo}/actions/workflows', {
    owner,
    repo,
  });
  return data;
}

// First call needed to get specific run_id of workflow to rerun.
// To verify order of runs (so we can always get latest), consider separating into 2 methods or at least helper
export async function rerunWorkflow(client: Octokit, owner: string, repo: string, workflowId: string) {
  const data = await client.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
    owner,
    repo,
    workflow_id: workflowId,
  });
  console.log(data);
  if (data.data.workflow_runs.length > 0) {
    const runId = data.data.workflow_runs[0].id;
    const response = await client.request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo,
      run_id: runId,
    });
    return response;
  }
  return null;
}

export async function enableWorkflowPermissions(client: Octokit, owner: string, repo: string) {
  const data = await client.request('PUT /repos/{owner}/{repo}/actions/permissions/workflow', {
    owner,
    repo,
    default_workflow_permissions: 'write',
  });
  return data;
}

// Need to update actions to use workflow_dispatch, better to not use if possible. Use rerunWorkflow instead
// https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch
export async function triggerWorkflowRun(
  client: Octokit,
  owner: string,
  repo: string,
  workflowId: string,
  ref: string,
) {
  const data = await client.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
    owner,
    repo,
    workflow_id: workflowId,
    ref,
  });
  return data;
}

export async function createRepoFromTemplate(client: Octokit, name: string) {
  const data = await client.request('POST /repos/{template_owner}/{template_repo}/generate', {
    template_owner: 'vvidday',
    template_repo: 'publish-RepoSense',
    name,
    include_all_branches: true,
  });
  return data;
}

export async function enablePages(client: Octokit, owner: string, repo: string) {
  const data = await client.request('POST /repos/{owner}/{repo}/pages', {
    owner,
    repo,
    source: {
      branch: 'gh-pages',
    },
  });
  return data;
}
