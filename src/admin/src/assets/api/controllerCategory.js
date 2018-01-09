import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

const getCategory = function () {
  return axios.get(APIS.category).catch(err => {
    console.log(err);
    Message({
      message: '获取文章分类失败!',
      type: 'error'
    });
  });
};

const newCategory = function (arg) {
  assert(arg, [{
    field: 'name',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.post(APIS.category, params).then(res => {
    Message({
      message: '新建分类成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    let errMsg = '新建分类失败!';
    if (err.msg && err.msg.includes('duplicate key error')) {
      errMsg = '存在相同的分类名!';
    }
    Message({
      message: errMsg,
      type: 'error'
    });
  });
};

const editCategory = function (arg) {
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
  return axios.put(APIS.category, params).then(res => {
    Message({
      message: '修改分类成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    let errMsg = '修改分类失败!';
    if (err.msg && err.msg.includes('duplicate key error')) {
      errMsg = '存在相同的分类名!';
    }
    Message({
      message: errMsg,
      type: 'error'
    });
  });
};

const delCategory = function (arg) {
  assert(arg, [{
    field: 'ids',
    required: true,
    type: 'string'
  }]);
  return axios.delete(APIS.category, { params: arg }).then(res => {
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
  getCategory,
  newCategory,
  editCategory,
  delCategory
};
