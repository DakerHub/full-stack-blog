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

const getPostDetail = function (id) {
  return axios.get(`${APIS.post}/${id}`).catch(err => {
    console.log(err);
  });
};

export {
  getPosts,
  getTags,
  getNewestPosts,
  getNewestComments,
  getPostDetail
};
