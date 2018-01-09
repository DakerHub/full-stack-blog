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
  tag: 'tags',
  category: 'categories'
};

export default pretendApiRoot(APIS);
