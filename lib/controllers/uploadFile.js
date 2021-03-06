const qiniu = require('qiniu');
// 需要填写你的 Access Key 和 Secret Key
const accessKey = '9VQdPlh4-eO6J4occH12T81IHtaJfdpBEtILLW0l';
const secretKey = 'vYgMFuvottid6ZHwxfT6jpMAbGWdIfKTs7QzgZh5';
// 要上传的空间
bucket = 'fblog';
// qiniu.conf.ACCESS_KEY = '9VQdPlh4-eO6J4occH12T81IHtaJfdpBEtILLW0l';
// qiniu.conf.SECRET_KEY = 'vYgMFuvottid6ZHwxfT6jpMAbGWdIfKTs7QzgZh5';

// 上传到七牛后保存的文件名
key = 'my-test.jpg';

const options = {
  scope: bucket + ':' + key
};

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy(options);

// 生成上传 Token
token = putPolicy.uploadToken(mac);
// 要上传文件的本地路径
filePath = './../../public/static/img/avatar_bg.jpg';

// 构造上传函数
function uploadFile(uptoken, key, localFile) {
  const config = new qiniu.conf.Config();
  // 是否使用https域名
  config.useHttpsDomain = true;
  // 上传是否使用cdn加速
  config.useCdnDomain = true;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  formUploader.putFile(uptoken, key, localFile, putExtra, function(respErr,
    respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }

    if (respInfo.statusCode == 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });
}
// 调用uploadFile上传
uploadFile(token, key, filePath);

// http://p36hatbi4.bkt.clouddn.com/my-test.jpg