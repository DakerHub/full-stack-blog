// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import Cookies from 'js-cookie';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import api from './assets/api';
import './assets/css/reset.css';
import './assets/css/palette.css';
import './assets/css/myTheme.css';
import './assets/icon/iconfont.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.api = api;
Vue.prototype.Cookies = Cookies;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
