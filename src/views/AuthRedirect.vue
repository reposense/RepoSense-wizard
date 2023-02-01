<script setup lang="ts">
import { onMounted } from 'vue';

const CALLBACK_URL_DEV = 'http://localhost:5173/auth';

onMounted(() => {
  const query = window.location.search;
  window.location.href = CALLBACK_URL_DEV + query;
})
</script>

<template lang="pug">
h1 Redirecting
</template>