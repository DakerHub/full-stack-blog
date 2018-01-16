import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';
import './assets/css/reset.css';
import './assets/icon/iconfont.css';
import './assets/css/palette.css';


export function createApp () {
  const router = createRouter();
  const store = createStore();
  sync(store, router);

  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
};

