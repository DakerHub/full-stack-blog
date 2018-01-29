import qs from 'qs';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import assert from './assert';

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
  return axios.post(APIS.login, params);
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
  return axios.post(APIS.user, params);
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
  return axios.patch(APIS.update_avatar, params, { needAuth: true });
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

  return axios.patch(APIS.update_password, params, { needAuth: true });
};

export {
  getPosts,
  getTags,
  getTagById,
  getNewestPosts,
  getNewestComments,
  getPostDetail,
  getUserInfo,
  login,
  newCommment,
  getPostComments,
  getSubComments,
  deleteComment,
  uploadAvatar,
  updatePassword,
  userRegister
};
