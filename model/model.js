/**
 * 用个id查询指定Model里的多个docs,有一个不存在就会失败!
 * @param {Model} Model 指定数据模型对象
 * @param {Array} ids id数组
 */
module.exports.findByIds = function (Model, ids) {
  return new Promise(function (resolve, reject) {
    const promises = [];
  
    ids.forEach(id => {
      promises.push(Model.findById(id).exec().then(result => {
        if (!result) {
          throw Error('can\'t find item whose id is' + id);
        }
      }));
    });
  
    if (promises.length > 0) {
      Promise.all(promises).then((docs) => {
        resolve(docs);
      }).catch((err) => {
        reject(err);
      });
    } else {
      resolve([]);
    }
  });
};
