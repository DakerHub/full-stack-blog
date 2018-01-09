import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

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

export { 
  getTags,
  delTag,
  newTag,
  editTag
};
