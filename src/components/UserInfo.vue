<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from '@/stores/store';
import { initClient, getAuthenticatedUser } from '@/util/github';

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
  loading.value = false;
})

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
</template>