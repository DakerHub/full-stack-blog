const { DB_URI } = require('./../config/config');
const mongoose = require('mongoose');

mongoose.connect(DB_URI, { useMongoClient: true });

module.exports.connection = mongoose.connection;
