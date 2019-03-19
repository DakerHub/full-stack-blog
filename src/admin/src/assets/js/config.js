
const isProd = process.env.NODE_ENV === 'production';
const APIROOT = isProd ? 'http://47.106.113.216/' : 'http://localhost:3000/';
const staticDir = isProd ? '/admin/static/' : '/static/';

export default {
  APIROOT,
  staticDir
};
