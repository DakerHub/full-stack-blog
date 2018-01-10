import qs from 'qs';
import { Message } from 'element-ui';
import APIS from './serverApi';
import axiosUtil from './axioswp';
import util from './../js/util';

const { assert } = util;
const { removeAll, axioswp: axios } = axiosUtil;

const getUsers = function (params) {
  return axios.get(APIS.user, { params }).catch(err => {
    console.error(err);
    Message({
      message: '获取用户失败!',
      type: 'error'
    });
  });
};

export {
  getUsers
};
