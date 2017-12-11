const { Users } = require('./../../lib/users');

const user = {
  username: 'fcc',
  password: '123456',
  regDate: Date.now(),
  userPic: ''
};
Users.create(user, function (err, newUser) {
  if (err) {
    if (err.code === 11000) {
      console.log(err.message);
    } else {
      console.error(err);
      return;
    }
  }
  console.log(newUser);
});
