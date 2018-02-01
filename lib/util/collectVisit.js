const { Pageview } = require('./../models/pageview');
const md5 = require('blueimp-md5');

module.exports.collectVisit = function (req) {
  const id = req.params.id;
  if (id) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const uniqueVisitor = md5(ip + userAgent);
    return new Promise(function (resolve, reject) {
      Pageview.count({ pageId: id, uniqueVisitor }, function (err, count) {
        if (!count) {
          Pageview.create({
            pageId: id,
            uniqueVisitor
          });
          return resolve(false);
        }
        resolve(true);
      });
    });
  }
  return Promise.resolve(false);
};
