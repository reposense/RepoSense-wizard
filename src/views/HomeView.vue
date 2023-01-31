<script setup lang="ts">
import { startAuth } from '../util/github';
import { useStore } from '../stores/store';
import UserInfo from '../components/UserInfo.vue';

const store = useStore();

</script>

<template lang="pug">
main
  user-info(
    v-if="store.isLoggedIn"
  )
  button.login-button(
    v-else,
    v-on:click="startAuth()"
  ) Log in with Github
</template>
