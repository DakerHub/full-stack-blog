import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

const getComment = function (params) {
  console.log(params);
  return axios.get(APIS.comment, { params }).catch(err => {
    console.log(err);
    Message({
      message: '获取文章评论失败!',
      type: 'error'
    });
  });
};

const newComment = function (arg) {
  assert(arg, [{
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
  const params = qs.stringify(arg);
  return axios.post(APIS.comment, params).then(res => {
    Message({
      message: '新建评论成功!',
      type: 'success'
    });
    return res;
  }).catch(err => {
    console.error(err);
    Message({
      message: '新建评论失败!',
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
  delComment
};
