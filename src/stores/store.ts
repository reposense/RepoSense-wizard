import { defineStore } from 'pinia';
import { ref } from 'vue';

const useStore = defineStore('store', () => {
  const isLoggedIn = ref(false);
  const accessToken = ref('');
  const username = ref('');

  function setLogIn(value: boolean) {
    isLoggedIn.value = value;
  }
  function setAccessToken(value: string) {
    accessToken.value = value;
  }
  function setUsername(value: string) {
    username.value = value;
  }

  return {
    isLoggedIn,
    setLogIn,
    accessToken,
    setAccessToken,
    username,
    setUsername,
  };
});

export default useStore;
