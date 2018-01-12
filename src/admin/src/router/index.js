import Vue from 'vue';
import Router from 'vue-router';
import TheLogin from '@/views/TheLogin.vue';
import TheHome from '@/views/TheHome.vue';
import AppMain from '@/views/AppMain.vue';
import PostList from '@/views/AppPostList.vue';
import PostNew from '@/views/AppPostNew.vue';
import PostEdit from '@/views/AppPostEdit.vue';
import TagManage from '@/views/AppTagManage.vue';
import CategoryManage from '@/views/AppCategoryManage.vue';
import UserList from '@/views/AppUserList.vue';
import UserEdit from '@/views/AppUserEdit.vue';
import CommentList from '@/views/AppCommentList.vue';

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
        },
        {
          path: 'user',
          name: 'UserList',
          component: UserList
        },
        {
          path: 'user/edit/:id',
          name: 'UserEdit',
          component: UserEdit
        },
        {
          path: '/comment',
          name: 'CommentList',
          component: CommentList
        }
      ]
    }
  ]
});
