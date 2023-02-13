<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useStore from '@/stores/store';
import { initClient, getAuthenticatedUser, triggerWorkflowRun, listWorkflows, enablePages, enableWorkflowPermissions, rerunWorkflow } from '@/util/github';

const store = useStore();
const loading = ref(true);
const userInfo = ref({
  avatarUrl: '',
  username: '',
});

onMounted(async () => {
  const client = initClient(store.accessToken);
  const response = await getAuthenticatedUser(client);
  userInfo.value.avatarUrl = response.data.avatar_url;
  userInfo.value.username = response.data.login;
  store.setUsername(response.data.login);
  loading.value = false;
})

async function test() {
  const client = initClient(store.accessToken);
  //const data = await enableWorkflowPermissions(client, 'vvidday', 'test');
  //const data = await enablePages(client, 'vvidday', 'test');
  //const data = await listWorkflows(client, 'vvidday', 'publish-RepoSense');
  const data = await rerunWorkflow(client, 'vvidday', 'test', 'main.yml');
  //const data = await triggerWorkflowRun(client, 'vvidday', 'test', 'main.yml', 'master');
  console.log(data);
}

</script>

<template lang="pug">
.loading(
  v-if="loading"
) Loading...
#user-info(
  v-else
)
  .user-info-avatar
    img.avatar(
      :src="userInfo.avatarUrl"
    )
  .user-info-username
    p {{ userInfo.username }}
button(
  v-on:click="test()"
) Test
</template>