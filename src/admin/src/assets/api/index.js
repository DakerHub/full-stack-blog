import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

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

const getPost = function (params) {
  return axios.get(APIS.post, { params }).catch(err => {
    console.log(err);
    Message({
      message: '获取文章列表失败!',
      type: 'error'
    });
  });
};

const delPost = function (ids) {
  const params = { ids };
  assert(params, [{
    field: 'ids',
    required: true,
    type: 'string'
  }]);
  return axios.delete(APIS.post, { params }).then(res => {
    Message({
      message: '删除成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '删除失败!',
      type: 'error'
    });
  });
};

const newPost = function (arg) {
  assert(arg, [{
    field: 'title',
    required: true,
    type: 'string'
  }, {
    field: 'abstract',
    required: true,
    type: 'string'
  }, {
    field: 'content',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.post(APIS.post, params).then(res => {
    Message({
      message: '添加文章成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '添加文章失败!',
      type: 'error'
    });
  });
};

const editPost = function (arg) {
  assert(arg, [{
    field: 'title',
    required: true,
    type: 'string'
  }, {
    field: 'abstract',
    required: true,
    type: 'string'
  }, {
    field: 'content',
    required: true,
    type: 'string'
  }, {
    field: '_id',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.put(APIS.post, params).then(res => {
    Message({
      message: '修改文章成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '修改文章失败!',
      type: 'error'
    });
  });
};

const getTags = function (arg) {
  const params = qs.stringify(arg);
  return axios.get(APIS.tag, { params }).catch(err => {
    console.error(err);
    Message({
      message: '获取标签列表失败!',
      type: 'error'
    });
  });
};

const delTag = function (params) {
  assert(params, [{
    field: 'ids',
    required: true,
    type: 'string'
  }]);
  return axios.delete(APIS.tag, { params }).then(res => {
    Message({
      message: '删除成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '删除失败!',
      type: 'error'
    });
  });
};

const newTag = function (arg) {
  assert(arg, [{
    field: 'name',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.post(APIS.tag, params).then(res => {
    Message({
      message: '添加标签成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    let errMsg = '修改标签失败!';
    if (err.msg && err.msg.includes('duplicate key error')) {
      errMsg = '存在相同的标签名!';
    }
    Message({
      message: errMsg,
      type: 'error'
    });
  });
};

const editTag = function (arg) {
  assert(arg, [{
    field: 'name',
    required: true,
    type: 'string'
  }, {
    field: '_id',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.put(APIS.tag, params).then(res => {
    Message({
      message: '修改标签成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    let errMsg = '修改标签失败!';
    if (err.msg && err.msg.includes('duplicate key error')) {
      errMsg = '存在相同的标签名!';
    }
    Message({
      message: errMsg,
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
  editTag
};
