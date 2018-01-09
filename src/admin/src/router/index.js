import Vue from 'vue';
import Router from 'vue-router';
import TheLogin from '@/views/TheLogin.vue';
import TheHome from '@/views/TheHome.vue';
import AppMain from '@/views/AppMain.vue';
import PostList from '@/views/PostList.vue';
import PostNew from '@/views/PostNew.vue';
import PostEdit from '@/views/PostEdit.vue';
import TagManage from '@/views/TagManage.vue';
import CategoryManage from '@/views/CategoryManage.vue';

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
          path: 'post/new',
          component: PostNew
        },
        {
          path: 'post/edit/:id',
          component: PostEdit
        },
        {
          path: 'tag',
          name: 'TagManage',
          component: TagManage
        },
        {
          path: 'category',
          name: 'CategoryManage',
          component: CategoryManage
        }
      ]
    }
  ]
});
