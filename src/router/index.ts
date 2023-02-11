import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';
import AuthRedirect from '../views/AuthRedirect.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/auth/redirect',
      name: 'auth-redirect',
      component: AuthRedirect,
    },
  ],
});

export default router;
