const { Users } = require('./../lib/models/users');
const user = {
  username: 'admin',
  password: '123456',
  userPic: '',
  userType: '1',
  regDate: Date.now()
};
Users.create(user, function (err) {
  if (err) {
    console.error('创建管理员失败!');
  } else {
    console.log('创建管理员成功!用户名:admin,密码:123456')
  }
  process.exit(0);
});
