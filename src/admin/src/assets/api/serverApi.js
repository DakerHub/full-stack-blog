import config from './../js/config';

const { APIROOT } = config;

function pretendApiRoot(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      obj[key] = config.APIROOT + element;
    }
  }
  return obj;
}

const APIS = {
  login: 'login',
  post: 'posts',
  postStatus: 'posts/publishStatus',
  tag: 'tags',
  category: 'categories',
  user: 'users',
  comment: 'comments',
  userPassword: 'users/password',
  userAvatar: 'users/avatar'
};

export default pretendApiRoot(APIS);
