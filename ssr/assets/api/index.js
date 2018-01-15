import qs from 'qs';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import assert from './assert';

const { removeAll, axioswp: axios } = axiosUtil;

const getRecentPost = function () {
  return axios.get(APIS.posts);
};

export {
  getRecentPost
};
