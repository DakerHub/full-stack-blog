const { mongoose, connection } = require('./connect');

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

const usersSchema = new mongoose.Schema(users);
const Users = mongoose.model('user', usersSchema);

module.exports.Users = Users;
module.exports.usersSchema = usersSchema;
