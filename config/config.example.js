const path = require('path');

const config = {
  DB_IP: '127.0.0.1',
  DB_PORT: '27017',
  DB_NAME: 'myBlog',
  DB_URI: 'mongodb://127.0.0.1:27017/myBlog',

  QINIU_ACCESS_KEY: '9VQdPlh4-eO6J4occH12T81IHtaJfdpBEtILLW0l',
  QINIU_SECRET_KEY: 'vYgMFuvottid6ZHwxfT6jpMAbGWdIfKTs7QzgZh5',
  QINIU_BASE_URL: 'http://p36hatbi4.bkt.clouddn.com/',
  // 要上传的空间
  QINIU_BUCKET: 'fblog',
  QINIU_ZONE: 'Zone_z2',

  SITE_URL: 'http://47.106.113.216:3000',
  STATIC_URL: 'http://47.106.113.216:3000/static',

  SITE_PATH: path.resolve(__dirname, './../'),
  STATIC_PATH: '/public/static',
  AVATAR_PATH: '/avatar/',
  POSTER_PATH: '/poster/',
  LOG_PATH: path.resolve(__dirname, '../log/myBlog.log'),
  DATE_LOG_PATH: path.resolve(__dirname, '../log/date/myBlog.log'),
  AVATAR_MAX_SIZE: 1048576, // bytes

  SECRET: 'secret',

  whiteList: ['/login', '/swagger.json']
};

module.exports = config;
