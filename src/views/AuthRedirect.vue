<script setup lang="ts">
import { onMounted } from 'vue';

/*
  This is a workaround for GitHub only allowing one redirect URL per app.
  During development, in order to redirect to localhost after auth, we first redirect
  to this page (/auth/redirect) on the hosted site, which then redirects to localhost.
*/

const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL as string;

onMounted(() => {
  const query = window.location.search;
  window.location.href = REDIRECT_URL + query;
})
</script>

<template lang="pug">
h1 Redirecting
</template>