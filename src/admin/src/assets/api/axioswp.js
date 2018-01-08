import { Message, MessageBox } from 'element-ui';
import axios from 'axios';
import Cookies from 'js-cookie';
import router from './../../router/index';
import ReqMap from './ReqMap';

const { CancelToken } = axios;
const reqMap = new ReqMap();
let loginMsgShow = false;
let reqId = 0;

const axioswp = axios.create({
  timeout: 10000
});

axioswp.interceptors.request.use(function (config) {
  const { url, cancelSame, noAuth } = config;
  const source = CancelToken.source();
  const curReqId = reqId++;
  source.id = curReqId;
  config.id = curReqId;

  // 为每个请求添加取消请求的方法
  config.cancelToken = source.token;

  // 将请求放入map中,并且取消之前相同url的请求(可通过config设置为不取消)
  reqMap.push({ url, source }, typeof cancelSame !== 'boolean' ? true : cancelSame);

  // 在所有需鉴权接口,都需要加上`Authorization`请求头
  if (!noAuth) {
    config.headers.Authorization = Cookies.get('blog-admin-token');
  }

  return config;
}, function (error) {
  // Do something with request error
  const { url, id } = error.config;
  
  console.log(error);
  // 当出错后,需要将该请求移出map
  reqMap.remove(url, id);
  return Promise.reject(error);
});

axioswp.interceptors.response.use(function (response) {
  // Do something with response data
  const { data, config: { url, id } } = response;

  // 请求完成后,将请求移出map
  reqMap.remove(url, id);

  // 403禁止访问
  if (data.code && data.code === 403) {
    if (!loginMsgShow) {
      loginMsgShow = true;
      MessageBox.alert('用户信息已失效,请重新登录!', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          router.push('/login');
          loginMsgShow = false;
        }
      });
    }
    return Promise.reject(data);
  } else if (data.code && data.code === 401) {
    MessageBox.alert('您未取得该接口的使用权限!', '提示', {
      confirmButtonText: '确定',
      callback: action => {
      }
    });
    return Promise.reject(data);
  } else if (data.code && data.code !== 200) {
    return Promise.reject(data);
  }
  return data;
}, function (error) {
  
  if (axios.isCancel(error)) {
    return Promise.reject(new Error('cancel request'));
  }
  
  const { url, id } = error.config;
  // 当出错后,需要将该请求移出map
  reqMap.remove(url, id);
  
  // Do something with response error
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.state === 403) {
      MessageBox.alert('用户信息已失效,请重新登录!', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          router.push('/login');
        }
      });
    } else {
      Message({
        message: '服务器返回数据错误!',
        type: 'error'
      });
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser
    MessageBox.alert(error.code === 'ECONNABORTED' ? '请求超时,请稍后重试!' : error.message, '提示', {
      confirmButtonText: '确定',
      callback: action => {
        if (!window.location.href.includes('login')) {
          // router.push('/error')
        }
      }
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  return Promise.reject(error);
});

export default {
  axioswp,
  removeAll() {
    setTimeout(() => {
      reqMap.removeAll();
    }, 0);
  }
};
