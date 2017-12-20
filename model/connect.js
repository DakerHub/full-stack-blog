const { DB_URI } = require('./../config/config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(DB_URI, { useMongoClient: true });

module.exports.connection = mongoose.connection;
module.exports.mongoose = mongoose;
