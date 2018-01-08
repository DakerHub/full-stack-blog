<template>
  <div>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="$router.push('/post/new')">
        写文章
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

    <el-table
      :data="list"
      :height="500"
      :row-class-name="tableRowClass"
      size="small"
      style="width: 100%"
      @row-click="tableRowClick">
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        label="发布状态"
        width="120">
        <template slot-scope="scoped">
          {{{'1': '公开', '2': '私有'}[scoped.row.publishStatus]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="标签"
        width="180">
        <template slot-scope="scoped">
          <el-tag
            v-for="item in scoped.row.tags"
            :key="item.id"
            size="small">{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建日期">
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="curPage"
      :page-sizes="[20, 40, 80]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="currentPageChange"
      @size-change="sizeChange">
    </el-pagination>

  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';
import elPage from './../assets/mixins/elPage.js';
import elTable from './../assets/mixins/elTable.js';

export default {
  name: 'PostList',
  mixins: [elTab, elPage, elTable],
  data () {
    return {
      list: [],
      filter: {}
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
  methods: {
    async getList() {
      try {
        const params = {
          page: this.curPage,
          size: this.pageSize
        }
        const { sources, total } = await this.api.getPost(params);
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
        names.push('“' + element.title + '”');
      });
      this.$msgbox({
        title: '提示',
        message: '确认删除以下文章：' + names.join('、') + '？',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await this.api.delPost(ids.join(','));
              this.getList();
              this.clearRowSelect();
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
    editItem() {
      const id = this.curSelect[0]._id;
      this.$router.push('/post/edit/' + id);
    }
  },
  created () {
    this.addTab('文章列表', '/post');
    this.getList();
  }
};
</script>

<style scoped>
.el-pagination{
  text-align: right;
}
</style>
