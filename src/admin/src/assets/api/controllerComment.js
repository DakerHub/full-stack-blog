import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

const getComment = function () {
  return axios.get(APIS.comment).catch(err => {
    console.log(err);
    Message({
      message: '获取文章评论失败!',
      type: 'error'
    });
  });
};

const newComment = function (arg) {
  assert(arg, [{
    field: 'name',
    required: true,
    type: 'string'
  }]);
  const params = qs.stringify(arg);
  return axios.post(APIS.comment, params).then(res => {
    Message({
      message: '新建评论成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    let errMsg = '新建评论失败!';
    if (err.msg && err.msg.includes('duplicate key error')) {
      errMsg = '存在相同的评论名!';
    }
    Message({
      message: errMsg,
      type: 'error'
    });
  });
};

const editComment = function (arg) {
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
  return axios.put(APIS.comment, params).then(res => {
    Message({
      message: '修改评论成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    let errMsg = '修改评论失败!';
    if (err.msg && err.msg.includes('duplicate key error')) {
      errMsg = '存在相同的评论名!';
    }
    Message({
      message: errMsg,
      type: 'error'
    });
  });
};

const delComment = function (arg) {
  assert(arg, [{
    field: 'ids',
    required: true,
    type: 'string'
  }]);
  return axios.delete(APIS.comment, { params: arg }).then(res => {
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
  getComment,
  newComment,
  editComment,
  delComment
};
