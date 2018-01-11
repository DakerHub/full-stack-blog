<template>
  <div>
    <el-button-group class="post-list-btns box-content">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="userNewShow = true">
        新建
      </el-button>
      <el-button
        :disabled="disabled.edit"
        type="primary"
        icon="el-icon-edit"
        @click="editItem">
        编辑
      </el-button>
      <el-button
        :disabled="disabled.del"
        type="primary"
        icon="el-icon-delete"
        @click="delItem">
        删除
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="tableOpt.multiMode = !tableOpt.multiMode">
        {{tableOpt.multiMode?'多选':'单选'}}
      </el-button>
    </el-button-group>

    <el-input
      class="box-content filter-input"
      :value="filter.username"
      prefix-icon="el-icon-search"
      placeholder="输入用户名查找"
      @change="val => filter.username = val">
      <i
        class="el-input__icon el-icon-circle-close"
        slot="suffix"
        v-show="filter.username !== ''"
        @click="filter.username = ''" />
    </el-input>
    
    <el-table
      class="box-content"
      :data="list"
      :height="500"
      :row-class-name="tableRowClass"
      size="small"
      style="width: 100%"
      @row-click="tableRowClick"
      @sort-change="tabelSortChange">
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="用户类型"
        width="180">
        <template slot-scope="scoped">
          {{userTypeMap[scoped.row.userType]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="regDate"
        sortable="custom"
        label="注册日期">
      </el-table-column>
    </el-table>

    <el-pagination
      class="box-content"
      :current-page="curPage"
      :page-sizes="[20, 40, 80]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="currentPageChange"
      @size-change="sizeChange">
    </el-pagination>
    
    <UserNew
      v-if="userNewShow"
      :show.sync="userNewShow"
      @update-list="getList"/>
  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';
import elPage from './../assets/mixins/elPage.js';
import elTable from './../assets/mixins/elTable.js';
import util from './../assets/js/util.js';
import UserNew from './ModelUserNew';

export default {
  name: 'UserList',
  mixins: [elTab, elPage, elTable],
  data () {
    return {
      list: [],
      tagList: [],
      categoryList: [],

      filter: {
        dateOrder: '',
        username: ''
      },
      userTypeMap: {
        '1': '管理员',
        '2': '普通用户'
      },
      userNewShow: false
    };
  },
  computed: {
    disabled() {
      const result = {
        edit: false,
        del: false
      };
      const curSelect = this.curSelect;
      switch (curSelect.length) {
        case 0:
          result.edit = true;
          result.del = true;
          break;
        case 1:
          break;
        default:
          result.edit = true;
          break;
      }
      return result;
    }
  },
  components: {
    UserNew
  },
  watch: {
    filter: {
      deep: true,
      handler() {
        this.getList();
      }
    }
  },
  created () {
    this.addTab('用户列表', '/user');
    this.getList();
  },
  methods: {
    async getList() {
      const { username, dateOrder } = this.filter;
      const params = {
        page: this.curPage,
        size: this.pageSize
      }
      
      username && (params.username = username);
      dateOrder && (params.dateOrder = dateOrder);

      try {
        const { sources, total } = await this.api.getUsers(params);
        this.list = sources;
        this.total = total;
      } catch (error) {
        console.log(error);
      }
    },
    delItem() {
      const ids = [];
      const names = [];
      this.curSelect.forEach(element => {
        ids.push(element._id);
        names.push('“' + element.username + '”');
      });
      this.$msgbox({
        title: '提示',
        message: '确认删除以下用户：' + names.join('、') + '？',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await this.api.deleteUser({ ids: ids.join(',') });
              this.getList();
              this.clearRowSelect();
              this.removeUserTab(ids);
              instance.confirmButtonLoading = false;
              done();
            } catch (error) {
              console.log(error);
              instance.confirmButtonLoading = false;
              this.$message({
                message: '删除失败!',
                type: 'error'
              });
            }
          } else {
            instance.confirmButtonLoading = false;
            done();
          }
          
        }
      }).catch(() => {});
    },
    removeUserTab(ids) {
      const routes = ids.map(id => '/user/edit/' + id);
      this.$store.commit('removeTabsByRoute', routes);
    },
    editItem() {
      const id = this.curSelect[0]._id;
      this.$router.push('/user/edit/' + id);
    },
    tabelSortChange({ order }) {
      console.log(order);
      if (order) {
        this.filter.dateOrder = {
          ascending: '1',
          descending: '-1'
        }[order];
      } else {
        this.filter.dateOrder = ''
      }
    }
  }
};
</script>

<style scoped>
.post-list-btns,.el-select,.el-cascader,.filter-input{
  margin-bottom: 15px;
}
.el-select,.el-cascader,.filter-input{
  vertical-align: middle;
  width: 160px;
}
.el-pagination{
  text-align: right;
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #fff;
}
.icon-fabu{
  height: 12px;
  font-size: 12px;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}
</style>
