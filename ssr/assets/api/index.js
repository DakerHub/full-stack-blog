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

const getTags = function () {
  return axios.get('http://192.168.17.150:3000/tags').catch(err => {
    alert(err);
  });
};

export {
  getPosts,
  getTags
};
