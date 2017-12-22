/**
 * 用个id查询指定Model里的多个docs,有一个不存在就会失败!
 * @param {Model} Model 指定数据模型对象
 * @param {Array} ids id数组
 */
function findByIds(Model, ids) {
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
}

/**
 * 用多个条件查询指定Model里的多个docs.
 * @param {Model} Model 指定数据模型对象
 * @param {Array} conditions 条件数组
 */
function findMulti(Model, conditions) {
  return new Promise(function (resolve, reject) {
    const promises = [];
  
    conditions.forEach(condition => {
      promises.push(Model.find(condition).exec());
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
}

/**
 * 用多个id删除指定Model里的多个docs.
 * @param {Model} Model 指定数据模型对象
 * @param {Array} ids id数组
 */
function delByIds(Model, ids) {
  return new Promise(function (resolve, reject) {
    const promises = [];
    ids.forEach(id => {
      promises.push(Model.deleteOne({ _id: id }).exec());
    });
    Promise.all(promises).then((docs) => {
      resolve(docs);
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports.findMulti = findMulti;
module.exports.delByIds = delByIds;
module.exports.findByIds = findByIds;
