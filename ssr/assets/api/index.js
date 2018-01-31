import qs from 'qs';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import assert from './assert';
import Message from './../../components/BaseMessage.js';

const { removeAll, axioswp: axios } = axiosUtil;

const getPosts = function (params) {
  assert(params, [{
    field: 'page',
    type: 'number'
  }, {
    field: 'size',
    type: 'number'
  }]);
  return axios.get(APIS.posts, { params }).catch(err => {
    alert(err);
  });
};

const getNewestPosts = function () {
  const params = {
    size: 5
  };
  return axios.get(APIS.posts, { params }).catch(err => {
    console.log(err);
  });
};

const getNewestComments = function () {
  const params = {
    size: 5
  };
  return axios.get(APIS.comments, { params }).catch(err => {
    console.log(err);
  });
};

const getTags = function () {
  return axios.get(APIS.tags).catch(err => {
    console.log(err);
  });
};

const getTagById = function (id) {
  const params = {
    id
  };
  assert(params, [{
    field: 'id',
    required: true,
    type: 'string'
  }]);
  return axios.get(APIS.tag, { params });
};

const getPostDetail = function (id) {
  return axios.get(`${APIS.post}/${id}`).catch(err => {
    console.log(err);
  });
};

const getUserInfo = function (id) {
  return axios.get(APIS.user, {
    needAuth: true
  }).catch(err => {
    console.log(err);
  });
};

const getPostComments = function (params) {
  assert(params, [{
    field: 'postId',
    required: true,
    type: 'string'
  }]);
  return axios.get(APIS.comments, { params });
};

const getSubComments = function (params) {
  assert(params, [{
    field: 'postId',
    required: true,
    type: 'string'
  }, {
    field: 'pId',
    required: true,
    type: 'string'
  }]);
  return axios.get(APIS.comments, { params });
};

const login = function (params) {
  assert(params, [{
    field: 'username',
    required: true,
    type: 'string'
  }, {
    field: 'password',
    required: true,
    type: 'string'
  }]);
  return axios.post(APIS.login, params).then(data => {
    Message({
      message: '登录成功！',
      type: 'success'
    });
    return data;
  }).catch(err => {
    Message({
      message: err.msg,
      type: 'error'
    });
    return Promise.reject(err);
  });
};

const userRegister = function (params) {
  assert(params, [{
    field: 'username',
    required: true,
    type: 'string'
  }, {
    field: 'password',
    required: true,
    type: 'string'
  }]);
  return axios.post(APIS.user, params).then(data => {
    Message({
      message: '注册成功，请登录！',
      type: 'success'
    });
    return data;
  }).catch(err => {
    let msg = err.msg;
    if (err.msg.includes('E11000')) {
      msg = '用户名已存在！';
    }
    Message({
      message: msg,
      type: 'error'
    });
    return Promise.reject(err);
  });
};

const newCommment = function (params) {
  assert(params, [{
    field: 'content',
    required: true,
    type: 'string'
  }, {
    field: 'postId',
    required: true,
    type: 'string'
  }, {
    field: 'authorId',
    required: true,
    type: 'string'
  }]);
  return axios.post(APIS.comment, params, {
    needAuth: true
  }).then(data => {
    Message({
      message: '评论成功！',
      type: 'success'
    });
    return data;
  }).catch(err => {
    Message({
      message: err.msg,
      type: 'error'
    });
    return Promise.reject(err);
  });
};

const deleteComment = function (id) {
  const params = { id };
  assert(params, [{
    field: 'id',
    required: true,
    type: 'string'
  }]);
  return axios.delete(APIS.comment, {
    params,
    needAuth: true
  }).then(data => {
    Message({
      message: '删除成功！',
      type: 'success'
    });
    return data;
  }).catch(err => {
    Message({
      message: err.msg,
      type: 'error'
    });
    return Promise.reject(err);
  });
};

const uploadAvatar = function (id, avatar) {
  if (!id) {
    throw new Error('[uploadAvatar] id is required!');
  }
  if (!avatar) {
    throw new Error('[uploadAvatar] avatar is required!');
  }
  const params = new FormData();
  params.append('id', id);
  params.append('avatar', avatar);
  return axios.patch(APIS.update_avatar, params, { needAuth: true }).then(data => {
    Message({
      message: '上传头像成功！',
      type: 'success'
    });
    return data;
  }).catch(err => {
    Message({
      message: err.msg,
      type: 'error'
    });
    return Promise.reject(err);
  });
};

const updatePassword = function (params) {
  assert(params, [{
    field: 'id',
    required: true,
    type: 'string'
  }, {
    field: 'oldPw',
    required: true,
    type: 'string'
  }, {
    field: 'newPw',
    required: true,
    type: 'string'
  }]);

  return axios.patch(APIS.update_password, params, { needAuth: true }).then(data => {
    Message({
      message: '修改密码成功！',
      type: 'success'
    });
    return data;
  }).catch(err => {
    Message({
      message: err.msg,
      type: 'error'
    });
    return Promise.reject(err);
  });
};

export {
  getPosts,
  getTags,
  getTagById,
  getNewestPosts,
  getNewestComments,
  getPostDetail,
  getUserInfo,
  getPostComments,
  getSubComments,
  login,
  newCommment,
  deleteComment,
  uploadAvatar,
  updatePassword,
  userRegister
};
