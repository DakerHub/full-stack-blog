const mongoose = require('mongoose');
const { DB_URI } = require('./../../config/config');
const logger = require('./../util/log');

mongoose.Promise = global.Promise;
mongoose.connect(DB_URI, { useMongoClient: true }, function (err) {
  if (err) {
    logger.dbErr(err);
  }
});

module.exports.connection = mongoose.connection;
module.exports.mongoose = mongoose;
