import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

const getUsers = function (params) {
  return axios.get(APIS.user, { 
    params,
    cancelSame: false
  }).catch(err => {
    console.error(err);
    Message({
      message: '获取用户失败!',
      type: 'error'
    });
  });
};

const newUser = function (arg) {
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
  return axios.post(APIS.user, params).then(res => {
    Message({
      message: '新建用户成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '新建用户失败!',
      type: 'error'
    });
  });
};

const editUser = function (arg) {
  assert(arg, [{
    field: '_id',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.put(APIS.user, params).then(res => {
    Message({
      message: '修改用户成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '修改用户失败!',
      type: 'error'
    });
  });
};

const updateUserPassword = function (arg) {
  assert(arg, [{
    field: '_id',
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
  const params = qs.stringify(arg);
  return axios.patch(APIS.userPassword, params).then(res => {
    Message({
      message: '修改密码成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: err.code === 400 ? err.msg : '修改密码失败!',
      type: 'error'
    });
  });
};

const updateUserAvatar = function (arg) {
  assert(arg, [{
    field: '_id',
    required: true,
    type: 'string'
  }, {
    field: 'avatar',
    required: true
  }]);
  const { avatar, _id } = arg;
  const params = new FormData();
  params.append('avatar', avatar);
  params.append('_id', _id);
  return axios.patch(APIS.userAvatar, params).then(res => {
    Message({
      message: '修改头像成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: err.code === 400 ? err.msg : '修改头像失败!',
      type: 'error'
    });
  });
};

const deleteUser = function (params) {
  assert(params, [{
    field: 'ids',
    required: true,
    type: 'string'
  }]);
  return axios.delete(APIS.user, { params }).then(res => {
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

export {
  getUsers,
  newUser,
  deleteUser,
  editUser,
  updateUserPassword,
  updateUserAvatar
};
