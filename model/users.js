const { connection } = require('./connect');

const users = {
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  regDate: Date,
  userPic: String
};

const Users = connection.model('user', users);

module.exports.connection = connection;
module.exports.Users = Users;
