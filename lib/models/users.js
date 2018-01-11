const { mongoose, connection } = require('./connect');

/**
 * username 用户名
 * password 密码
 * userType 用户类型 1: '管理员', 2: '普通用户';
 * sex 性别 1: '男', 2: '女';
 * age 年龄
 * regDate 注册时间
 * userPic 用户头像
 */
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
  userType: {
    type: String,
    enum: ['1', '2'],
    required: true
  },
  sex: {
    type: String,
    enum: ['1', '2', '3']
  },
  age: {
    type: Number
  },
  phone: {
    type: String
  },
  mail: {
    type: String
  },
  regDate: Date,
  userPic: String
};

const usersSchema = new mongoose.Schema(users);
const Users = mongoose.model('user', usersSchema);

module.exports.Users = Users;
module.exports.usersSchema = usersSchema;
