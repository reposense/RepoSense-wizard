import { defineStore } from 'pinia';
import { ref } from 'vue';

const useStore = defineStore('store', () => {
  const isLoggedIn = ref(false);
  const accessToken = ref('');

  function setLogIn(value: boolean) {
    isLoggedIn.value = value;
  }
  function setAccessToken(value: string) {
    accessToken.value = value;
  }

  return {
    isLoggedIn,
    setLogIn,
    accessToken,
    setAccessToken,
  };
});

export default useStore;
