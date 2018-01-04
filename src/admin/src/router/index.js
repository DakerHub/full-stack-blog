import Vue from 'vue';
import Router from 'vue-router';
import TheLogin from '@/views/TheLogin.vue';
import AppMain from '@/views/AppMain.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'TheLogin',
      component: TheLogin
    },
    {
      path: '/',
      name: 'AppMain',
      component: AppMain
    }
  ]
});
