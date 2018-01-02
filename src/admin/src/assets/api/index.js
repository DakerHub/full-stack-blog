import APIS from './serverApi';
import axios from './axioswp';

console.log(APIS);
const login = function ({ username, password }) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return axios.post(APIS.login, params).then(data => {
    console.log(data);
  });
}

export default {
  login
};
