import _ from 'lodash';

function assert(params, conditions) {
  conditions.forEach(condition => {
    const { field, required, type, children } = condition;
    const value = params[field];
    if (required && typeof value === 'undefined') {
      throw new Error('The argument `' + field + '` is required');
    }
    if (type && typeof value !== type) {
      throw new Error('The argument `' + field + '` must be ' + type);
    }
    if (value && Array.isArray(children)) {
      assert(value, children);
    }
  });
}

/**
 * 将列表根据父子关系添加到指定节点的后代中
 * @param {Array} parents 需要添加的父数组
 * @param {Array} list 待添加的子列表数组
 * @param {String} labelName 节点名的标识符
 */
function addChildren(parents, list, alias) {
  const { id, pId, label } = alias;
  parents.forEach(function (parent) {
    const pid = parent[id];
    parent.label = parent[label];
    list.forEach(function (item, index, arr) {
      if ('' + item[pId] === '' + pid) {
        Array.isArray(parent.children) ? parent.children.push(item) : parent.children = [item];
      }
    }, this);
    Array.isArray(parent.children) && addChildren(parent.children, list, alias);
  }, this);
}

/**
 * 将列表结构的数据装换为树形结构的数据
 * @param {Array} list 列表
 * @param {String,Number} rootId 根id
 * @param {String} labelName 节点名的标识符
 */
function list2tree(list, rootId, alias) {
  const { id, pId, label } = alias;
  const listCopy = _.cloneDeep(list);
  const result = [];
  listCopy.some(function (item) {
    if ('' + item[id] === '' + rootId) {
      item.label = item[label];
      result.push(item);
      return true;
    }
    return false;
  }, this);
  addChildren(result, listCopy, alias);
  return result;
}

export default {
  assert,
  list2tree
};
