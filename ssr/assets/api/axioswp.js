import axios from 'axios';
import Cookies from 'js-cookie';

const axioswp = axios.create({
  timeout: 10000
});

axioswp.interceptors.request.use(function (config) {
  const { needAuth } = config;
  // 在所有需鉴权接口,都需要加上`Authorization`请求头
  if (needAuth) {
    config.headers.Authorization = Cookies.get('blogToken');
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

axioswp.interceptors.response.use(function (res) {
  const { data } = res;
  if (data.code !== 200) {
    return Promise.reject(data);
  }
  return data;
}, function (error) {});

export default {
  axioswp
};
