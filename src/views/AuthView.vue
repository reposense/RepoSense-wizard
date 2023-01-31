<script setup lang="ts">
import axios from 'axios';
import { onMounted } from 'vue';
import router from '@/router';
import { useStore } from '@/stores/store';

const authServerURL = import.meta.env.VITE_AUTH_SERVER_URL as string | undefined;
if (!authServerURL) {
  throw new Error('VITE_AUTH_SERVER_URL is not defined, check your .env file');
}

const store = useStore();

onMounted(async () => {
  const { code, state } = router.currentRoute.value.query;
  if (code && state === sessionStorage.getItem('github-oauth-state')) {
    const res = await axios.get(
      authServerURL,
      {
        params: {
          code,
        },
      },
    );

    const data = await res.data;
    if (!data.access_token) {
      throw new Error('No access token, auth failed' + data);
    } else {
      store.setLogIn(true);
      store.setAccessToken(data.access_token);
      router.push('/');
    }
  } else {
    throw new Error('Invalid state or code, auth failed');
  }
});

</script>

<template lang="pug">
main
</template>
