import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

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
  }, {
    field: 'poster',
    required: true
  }]);
  const params = new FormData();
  for (const key in arg) {
    if (arg.hasOwnProperty(key)) {
      params.append(key, arg[key]);
    }
  }
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
  const params = new FormData();
  for (const key in arg) {
    if (arg.hasOwnProperty(key)) {
      params.append(key, arg[key]);
    }
  }
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

const updatePostStatus = function (arg) {
  assert(arg, [{
    field: 'ids',
    required: true,
    type: 'string'
  }, {
    field: 'publishStatus',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  const operateName = {
    1: '发布',
    2: '撤回'
  }[arg.publishStatus];

  return axios.patch(APIS.postStatus, params).then(res => {
    Message({
      message: operateName + '文章成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: operateName + '文章失败!',
      type: 'error'
    });
  });
};

export {
  getPost,
  delPost,
  newPost,
  editPost,
  updatePostStatus
};
