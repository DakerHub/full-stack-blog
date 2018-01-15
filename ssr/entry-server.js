import { createApp } from './app';

const isDev = process.env.NODE_ENV !== 'production';

export default context => new Promise((resolve, reject) => {
  const s = isDev && Date.now();
  const { app, router, store } = createApp();
  // 设置服务器端 router 的位置
  router.push(context.url);
  // 等到 router 将可能的异步组件和钩子函数解析完
  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();
    // 匹配不到的路由，执行 reject 函数，并返回 404
    if (!matchedComponents.length) {
      return reject({ code: 404 });
    }

    Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
      store,
      route: router.currentRoute
    }))).then(() => {
      isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`);
      context.state = store.state;
      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      resolve(app);
    }).catch(reject);
  }, reject);
});
