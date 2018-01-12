const Vue = require('vue');
const App = require('./App.vue');
import { createRouter } from './router';

const router = createRouter();

export function createApp () {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    router,
    render: h => h(App)
  })
  return { app }
};

