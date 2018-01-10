import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';
import { getTags, delTag, newTag, editTag } from './controllerTag';
import { getPost, delPost, newPost, editPost } from './controllerPost';
import { getCategory, newCategory, editCategory, delCategory } from './controllerCategory';
import { getUsers } from './controllerUser';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

const login = function (arg) {
  assert(arg, [{
    field: 'username',
    required: true,
    type: 'string'
  }, {
    field: 'password',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.post(APIS.login, params).then(res => {
    Message({
      message: '登录成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '登录失败!',
      type: 'error'
    });
  });
};

export default {
  login,
  getPost,
  delPost,
  newPost,
  editPost,
  getTags,
  delTag,
  newTag,
  editTag,
  getCategory,
  newCategory,
  editCategory,
  delCategory,
  getUsers
};
