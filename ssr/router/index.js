import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const TheHome = () => import('../views/TheHome.vue');

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        redirect: '/blog/'
      },
      {
        path: '/blog/',
        component: TheHome
      }
    ]
  });
}
