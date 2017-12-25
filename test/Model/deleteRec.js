const { deleteByIdsRecursive } = require('./../../model/model');
const { Categories } = require('./../../model/categories.js');

deleteByIdsRecursive(Categories, ['5a409c47ac2daa13e052b144'], 'pId').then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
