const path = require('path');

const DB_IP = '127.0.0.1';
const DB_PORT = '27017';
const DB_NAME = 'myBlog';
const STATIC_PATH = path.resolve(__dirname, './../public/static');

module.exports.DB_URI = 'mongodb://' + DB_IP + ':' + DB_PORT + '/' + DB_NAME;
module.exports.STATIC_PATH = STATIC_PATH;
