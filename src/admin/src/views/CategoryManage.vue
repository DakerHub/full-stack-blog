<template>
  <div class="category-manage">
    <el-tree
      node-key="_id"
      :props="{label: 'name', children: 'children'}"
      :data="categorys"
      :default-expanded-keys="expandedCst"
      :render-content="renderNodeContent"
      :indent="24"
      :auto-expand-parent= "false" />
  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';
import util from './../assets/js/util.js';

export default {
  name: 'CategoryManage',
  mixins: [elTab],
  data() {
    return {
      categorys: [],

      editInputVal: '',
      editNodeId: ''
    };
  },
  computed: {
    expandedCst() {
      return this.getTreeIds(this.categorys, 0, 2);
    },
    topId() {
      return this.categorys.length > 0 && this.categorys[0]._id
    }
  },
  created () {
    this.addTab('分类管理', '/category');
    this.getList();
  },
  methods: {
    async getList() {
      try {
        const { sources } = await this.api.getCategory();
        sources.push({
          _id: '0',
          pId: '-1',
          name: '全部'
        });
        this.categorys = util.list2tree(sources, '0', {
          id: '_id',
          pId: 'pId',
          label: 'name'
        });
      } catch (error) {
        console.error(error);        
      }
    },
    renderNodeContent(h, { node, data }) {
      this.$set(data, 'submiting', false);
      const self = this;
      const inRename = this.editNodeId === data._id;
      const wrapperClass = data.isNew ? 'tree-node-conent in-rename' : 'tree-node-conent';

      const ctrs = [h('i', {
        'class': 'el-icon-circle-plus-outline tree-node-btn',
        style: {
          display: inRename ? 'none' : 'inline'
        },
        on: {
          click: function (e) {
            e.stopPropagation()
            self.addChild(e, node, data)
          }
        },
        attrs: {
          title: '添加子节点'
        }
      })];
      if (this.topId !== data._id) {
        ctrs.push(...[h('i', {
            'class': 'el-icon-edit-outline tree-node-btn',
            style: {
              display: inRename ? 'none' : 'inline'
            },
            on: {
              click: function (e) {
                e.stopPropagation()
                self.beforeRename(e.target, node, data)
              }
            },
            attrs: {
              title: '重命名'
            }
          }),
          h('i', {
            'class': 'el-icon-circle-close-outline tree-node-btn',
            style: {
              display: inRename ? 'none' : 'inline'
            },
            on: {
              click: function (e) {
                e.stopPropagation()
                self.confirmDel(e, node, data)
              }
            },
            attrs: {
              title: '删除节点'
            }
          }),
          h('i', {
            'class': ['el-icon-circle-check-outline', self.editInputVal === '' ? 'disabled' : ''],
            style: {
              display: !inRename || data.submiting ? 'none' : 'inline'
            },
            on: {
              click: function (e) {
                e.stopPropagation()
                self.editInputVal !== '' && self.rename(e, node, data)
              }
            },
            attrs: {
              title: '确认'
            }
          }),
          h('i', {
            'class': 'el-icon-remove-outline',
            style: {
              display: !inRename || data.submiting ? 'none' : 'inline'
            },
            on: {
              click: function (e) {
                e.stopPropagation()
                self.cancelRename(e, node, data)
              }
            },
            attrs: {
              title: '取消'
            }
          })
        ]);
      };
      return h('span', {'class': [wrapperClass, inRename ? 'in-rename' : '']}, [
        h('span', {
          style: {
            display: inRename ? 'none' : 'inline'
          },
          'class': 'tree-node-label'}, node.label),
        h('input', {
          'class': 'tree-node-input',
          style: {
            display: inRename ? 'inline' : 'none'
          },
          domProps: {
            value: self.editInputVal
          },
          on: {
            click: function (e) { e.stopPropagation(); },
            input (e) {
              let val = e.target.value;
              let result = val.match(/([\u4e00-\u9fa5]|\w)+/g);
              result = result ? result.join('') : '';
              e.target.value = result;
              self.editInputVal = result;
            },
            keyup (e) {
              if (e.keyCode === 13 && self.editInputVal !== '') {
                self.rename(e, node, data);
              }
            }
          },
          attrs: {
            placeholder: '请输入分类名称',
            maxlength: 10
          }
        }),
        h('span', {'class': 'tree-node-ctr'}, ctrs)
      ]);
    },
    addChild(e, node, data) {
      const newId = Math.random() + '';
      const newNode = {
        _id: newId,
        name: '',
        pId: data._id,
        isNew: true,
        children: []
      };
      if (node.childNodes && node.childNodes.length > 0) {
        node.store.append(newNode, data);
      } else {
        console.log(node);
        node.doCreateChildren([newNode]);
        node.expand();
      }
      this.editNodeId = newId;
    },
    beforeRename(el, node, data) {
      this.editInputVal = data.name;
      this.editNodeId = data._id;
    },
    confirmDel(e, node, data) {
      try {
        this.$msgbox({
          title: '提示',
          message: '删除该分类将删除该分类下的子分类！',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '算了',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                const res = await this.api.delCategory({ ids: data._id });
                if (res) {
                  node.store.remove(data);
                }
                instance.confirmButtonLoading = false;
                done();
              } catch (error) {
                console.log(error);
                instance.confirmButtonLoading = false;
              }
            } else {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        }).catch(() => {});
      } catch (error) {
        console.error(error);
      }
    },
    async rename(e, node, data) {
      if (data.isNew) {
        const params = {
          name: this.editInputVal,
          pId: data.pId
        }
        try {
          data.submiting = true;
          const { sources } = await this.api.newCategory(params);
          data._id = sources._id;
          data.name = sources.name;
          this.hideRename();
        } catch (error) {
          console.error(error);
        } finally {
          data.submiting = false;
        }
      } else {
        const params = {
          name: this.editInputVal,
          _id: data._id 
        }
        try {
          data.submiting = true;
          await this.api.editCategory(params);
          data.name = this.editInputVal;
          this.hideRename();
        } catch (error) {
          console.error(error);
        } finally {
          data.submiting = false;
        }
      }
    },
    cancelRename(e, node, data) {
      if (data.isNew) {
        node.store.remove(data);
      }
      this.hideRename();
    },
    hideRename() {
      this.editNodeId = '';
      this.editInputVal = '';
    },
    getTreeIds(brothers, level, target) {
      const result = [];
      Array.isArray(brothers) && brothers.forEach(element => {
        result.push(element._id);
        if (Array.isArray(element.children) && level + 1 <= target) {
          const childResult = this.getTreeIds(element.children, level + 1, target);
          result.push(...childResult);
        }
      });
      return result;
    }
  }
}
</script>

<style scoped>
.category-manage >>> .tree-node-ctr i {
  margin-left: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #3f51b5;
}
.category-manage >>> .tree-node-ctr i:hover{
  color: #768af5;
}
.category-manage >>> .tree-node-ctr i:active{
  color: #3f51b5;
}
.category-manage >>> .tree-node-input{
  display: none;
}
.category-manage >>> .tree-node-label{
  font-size: 14px;
  color: #303133;
  font-family: "Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.category-manage >>> .tree-node-ctr{
  display: none;
}
.category-manage >>> .tree-node-conent{
  display: flex;
  align-items: center;
}
.category-manage >>> .el-tree-node__content:hover .tree-node-ctr{
  display: inline;
}
.category-manage >>> .tree-node-input:hover {
  border-color: #8391a5;
}
.category-manage >>> .tree-node-input:focus {
  outline: 0;
  border-color: #3F51B5;
}
.category-manage >>> .tree-node-input{
  display: none;
  width: 140px;
  height: 24px;
  font-size: 14px;
  line-height: 1;
  outline: 0;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  background-color: #fff;
  padding: 3px 5px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
.category-manage >>> .tree-node-input::-webkit-input-placeholder{
  font-size: 12px;
  line-height: 30px;
}
.category-manage >>> .el-icon-circle-check-outline.disabled{
  cursor: not-allowed;
}
</style>
