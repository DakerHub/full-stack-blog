import Vue from 'vue';
import Router from 'vue-router';
import TheLogin from '@/views/TheLogin.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TheLogin',
      component: TheLogin
    }
  ]
});
