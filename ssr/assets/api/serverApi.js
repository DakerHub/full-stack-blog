import config from './../config/config';

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
  posts: 'posts',
  post: 'post',
  user: 'user',
  update_avatar: 'user/avatar',
  update_password: 'user/password',
  comment: 'comment',
  comments: 'comments',
  tags: 'tags',
  tag: 'tag',
  login: 'login'
};

export default pretendApiRoot(APIS);
