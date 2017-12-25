const { findByParentIdsRecursive } = require('./../../model/model');
const { Categories } = require('./../../model/categories.js');

findByParentIdsRecursive(Categories, ['5a3cb79b33c1373974c21475'], 'pId').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
});
