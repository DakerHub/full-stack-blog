/**
 * 用个id查询指定Model里的多个docs,有一个不存在就会失败!
 * @param {Model} Model 指定数据模型对象
 * @param {Array} ids id数组
 */
function findByIds(Model, ids, fields) {
  return new Promise(function (resolve, reject) {
    const promises = [];
  
    ids.forEach(id => {
      promises.push(
        Model
          .findById(id)
          .select(fields || '')
          .exec()
          .then(result => {
            if (!result) {
              throw Error('can\'t find item whose id is ' + id);
            }
            return result;
          })
      );
    });
  
    Promise.all(promises).then((docs) => {
      resolve(docs);
    }).catch((err) => {
      reject(err);
    });
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
  
    Promise.all(promises).then((docs) => {
      resolve(docs);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * 用多个id删除指定Model里的多个docs.
 * @param {Model} Model 指定数据模型对象
 * @param {Array} ids id数组
 */
function deleteByIds(Model, ids) {
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

/**
 * 通过传入的父节点id数组,递归的查找其孙子节点,并把找到的节点组成列表返回
 * @param {Model} Model 要操作的Model
 * @param {Array} ids 需要查找的数据的父节点id数组
 * @param {String} parentId 存储父节点id的变量名
 */
function findByParentIdsRecursive(Model, ids, parentId) {
  return new Promise(function (resolve, reject) {
    const promises = [];
    ids.forEach(pId => {
      promises.push(Model.find({ [parentId]: pId }).lean().exec());
    });
    Promise.all(promises).then(childrenArr => {
      const childrenIds = [];
      const result = [];
      childrenArr.forEach(children => {
        children.forEach(chlid => {
          childrenIds.push(chlid._id);
          result.push(chlid);
        });
      });
      if (childrenIds.length === 0) {
        resolve([]);
      } else {
        findByParentIdsRecursive(Model, childrenIds, parentId).then(grandson => {
          resolve(result.concat(grandson));
        });
      }
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 根据传入的ids,递归地删除其所有的子孙节点
 * @param {Model} Model 要操作的Model
 * @param {Array} ids 需要删除的数据的id数组
 * @param {String} parentId 存储父节点id的变量名
 */
function deleteByIdsRecursive(Model, ids, parentId) {
  return new Promise(function (resolve, reject) {
    findByParentIdsRecursive(Model, ids, parentId).then(docs => {
      ids.push(...docs.map(doc => doc._id));
      deleteByIds(Model, ids).then((res) => {
        resolve(res);
      });
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports.findMulti = findMulti;
module.exports.deleteByIds = deleteByIds;
module.exports.findByIds = findByIds;
module.exports.findByParentIdsRecursive = findByParentIdsRecursive;
module.exports.deleteByIdsRecursive = deleteByIdsRecursive;
