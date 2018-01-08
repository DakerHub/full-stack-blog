// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import mavonEditor from 'mavon-editor';
import Cookies from 'js-cookie';
import 'element-ui/lib/theme-chalk/index.css';
import 'mavon-editor/dist/css/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import api from './assets/api';
import './assets/css/reset.css';
import './assets/css/palette.css';
import './assets/css/myTheme.css';
import './assets/icon/iconfont.css';
    
Vue.config.productionTip = false;
Vue.use(ElementUI, { size: 'small' });
Vue.use(mavonEditor);
Vue.prototype.api = api;
Vue.prototype.Cookies = Cookies;

router.beforeEach((to, from, next) => {
  if (!Cookies.get('blog-admin-token') && !to.meta.noAuth) {
    router.replace('/login');
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
