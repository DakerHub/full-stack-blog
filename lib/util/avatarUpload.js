const multer = require('multer');
const logger = require('./log');
const md5 = require('blueimp-md5');
const { STATIC_PATH, SITE_PATH, AVATAR_PATH, AVATAR_MAX_SIZE } = require('./../../config/config');

const storage = multer.diskStorage({
  // 文件存储路径为设置里的STATIC路径
  destination: (req, file, cb) => {
    cb(null, SITE_PATH + STATIC_PATH + AVATAR_PATH);
  },
  // 在文件名后加上时间戳
  filename: (req, file, cb) => {
    const fileName = file.originalname.split('.');
    const extention = fileName.pop();
    const newName = md5(fileName.join('.') + Date.now()) + '.' + extention;
    cb(null, newName);
  }
});
const limits = {
  fileSize: AVATAR_MAX_SIZE
};
const fileFilter = function (req, file, cb) {
  if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
    cb(new Error('图片只支持png和jpg上传。'));
  }
  cb(null, true);
};

const upload = multer({ storage, limits, fileFilter }).single('avatar');

module.exports.avatarUpload = function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      logger.reqErr(err, req);
      res.send({
        code: 500,
        msg: err.errmsg || err.message
      });
      return;
    }
    next();
  });
};
