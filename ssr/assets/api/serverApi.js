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
  comments: 'comments',
  tags: 'tags'
};

export default pretendApiRoot(APIS);
