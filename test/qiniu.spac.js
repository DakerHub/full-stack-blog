const { uploadToQiniu, deleteFromQiniu } = require('./../lib/util/qiniu');

// uploadToQiniu('default_avatar.png', './../public/static/avatar/default_avatar.png').then(body => {
//   console.log(body);
// }).catch(err => {
//   console.log(err);
// });
deleteFromQiniu('my-test.jpg').then(body => {
  console.log(body);
}).catch(err => {
  console.log(err);
});
