import axios from 'axios';
import Cookies from 'js-cookie';

const axioswp = axios.create({
  timeout: 10000
});

axioswp.interceptors.request.use(function (config) {
  const { noAuth } = config;
  // 在所有需鉴权接口,都需要加上`Authorization`请求头
  // if (!noAuth) {
  // config.headers.Authorization = Cookies.get('blog-token');
  config.headers.Authorization = 'TOKEN001';
  // }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default {
  axioswp
};
