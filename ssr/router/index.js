import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const TheHome = () => import('../views/TheHome.vue');

export function createRouter() {
  return new Router({
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        component: TheHome
      }
    ]
  });
}
