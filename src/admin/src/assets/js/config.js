
const isProd = process.env.NODE_ENV === 'production';
const APIROOT = isProd ? 'http://192.168.17.150:3000/' : 'http://localhost:3000/';
const staticDir = isProd ? '/admin/static/' : '/static/';

export default {
  APIROOT,
  staticDir
};
