const qiniu = require('qiniu');
const {
  QINIU_ACCESS_KEY,
  QINIU_SECRET_KEY,
  QINIU_BASE_URL,
  QINIU_BUCKET,
  QINIU_ZONE
} = require('./../../config/config');

const options = {
  scope: QINIU_BUCKET
};
const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);
const putPolicy = new qiniu.rs.PutPolicy(options);
const config = new qiniu.conf.Config();
// 是否使用https域名
// config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;
config.zone = qiniu.zone[QINIU_ZONE];

const bucketManager = new qiniu.rs.BucketManager(mac, config);

// 调用uploadFile上传
module.exports.uploadToQiniu = function (fileName, filePath) {
  // 生成上传 Token
  const token = putPolicy.uploadToken(mac);

  // 构造上传函数
  function uploadFile(uptoken, key, localFile) {
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    return new Promise(function (resolve, reject) {
      formUploader.putFile(uptoken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          return reject(respErr);
        }

        if (respInfo.statusCode === 200) {
          respBody.url = QINIU_BASE_URL + respBody.key;
          return resolve(respBody);
        }
        reject(respInfo);
      });
    });
  }
  return uploadFile(token, fileName, filePath);
};

module.exports.deleteFromQiniu = function (fileName) {
  return new Promise((resolve, reject) => {
    bucketManager.delete(QINIU_BUCKET, fileName, function (err, respBody, respInfo) {
      if (err) {
        return reject(err);
      }
      if (respInfo.statusCode === 200) {
        return resolve(respBody);
      }
      reject(respInfo);
    });
  });
};