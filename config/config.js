const path = require('path');

const DB_IP = '127.0.0.1';
const DB_PORT = '27017';
const DB_NAME = 'myBlog';
const SITE_PATH = path.resolve(__dirname, './../');
const STATIC_PATH = '/public/static';
const SITE_URL = 'http://localhost:3000';
const STATIC_URL = SITE_URL + '/static';
const AVATAR_PATH = '/avatar/';
const SECRET = 'fcclovepotato@';
const whiteList = ['/login', '/api-docs.json'];

module.exports.DB_URI = 'mongodb://' + DB_IP + ':' + DB_PORT + '/' + DB_NAME;
module.exports.STATIC_PATH = STATIC_PATH;
module.exports.STATIC_URL = STATIC_URL;
module.exports.SITE_URL = SITE_URL;
module.exports.SITE_PATH = SITE_PATH;
module.exports.AVATAR_PATH = AVATAR_PATH;
module.exports.SECRET = SECRET;
module.exports.whiteList = whiteList;