const path = require('path');

const config = {
  DB_IP: '127.0.0.1',
  DB_PORT: '27017',
  DB_NAME: 'myBlog',
  DB_URI: 'mongodb://127.0.0.1:27017/myBlog',

  SITE_URL: 'http://192.168.17.150:3000',
  STATIC_URL: 'http://192.168.17.150:3000/static',

  SITE_PATH: path.resolve(__dirname, './../'),
  STATIC_PATH: '/public/static',
  AVATAR_PATH: '/avatar/',
  POSTER_PATH: '/poster/',
  LOG_PATH: path.resolve(__dirname, '../log/myBlog.log'),
  DATE_LOG_PATH: path.resolve(__dirname, '../log/date/myBlog.log'),

  SECRET: 'fcclovepotato@',

  whiteList: ['/login', '/swagger.json']
};

module.exports = config;
