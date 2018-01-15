import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const TheMain = () => import('../views/TheMain.vue');
const TheHome = () => import('../views/TheHome.vue');
const Other = () => import('../views/Other.vue');
const TheLogin = () => import('../views/TheLogin.vue');

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
        component: TheMain,
        children: [
          {
            path: '',
            component: TheHome
          },
          {
            path: 'Other',
            component: Other
          }
        ]
      },
      {
        path: '/blog/login',
        component: TheLogin
      }
    ]
  });
}
