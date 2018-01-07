import Vue from 'vue';
import Router from 'vue-router';
import TheLogin from '@/views/TheLogin.vue';
import TheHome from '@/views/TheHome.vue';
import AppMain from '@/views/AppMain.vue';
import PostList from '@/views/PostList.vue';
import TagList from '@/views/TagList.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'TheLogin',
      component: TheLogin,
      meta: {
        noAuth: true
      }
    },
    {
      path: '/',
      component: AppMain,
      children: [
        {
          path: '',
          component: TheHome
        },
        {
          path: 'home',
          name: 'TheHome',
          component: TheHome
        },
        {
          path: 'post',
          name: 'PostList',
          component: PostList
        },
        {
          path: 'tag',
          name: 'TagList',
          component: TagList
        }
      ]
    }
  ]
});
