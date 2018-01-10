<template>
  <div>
    <el-button-group class="post-list-btns box-content">
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

    <el-select
      class="box-content"
      v-model="filter.status"
      clearable
      placeholder="根据发布状态过滤">
      <el-option label="公开" value="1" />
      <el-option label="私有" value="2" />
    </el-select>

    <el-select
      class="box-content"
      v-model="filter.tag"
      clearable
      placeholder="根据标签过滤">
      <el-option
        v-for="tag in tagList"
        :key="tag._id"
        :label="tag.name"
        :value="tag._id" />
    </el-select>

    <el-cascader
      class="box-content"
      v-model="filter.category"
      :options="categoryList"
      :props="{value:'_id','label':'name',children:'children'}"
      clearable
      placeholder="根据分类过滤" />

    <el-input
      class="box-content filter-input"
      :value="filter.title"
      prefix-icon="el-icon-search"
      placeholder="输入标题关键词"
      @change="val => filter.title = val">
      <i
        class="el-input__icon el-icon-circle-close"
        slot="suffix"
        v-show="filter.title !== ''"
        @click="filter.title = ''" />
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
        label="标签"
        width="180">
        <template slot-scope="scoped">
          <el-tag
            v-for="item in scoped.row.tags.filter(Boolean)"
            :key="item.id"
            color="rgba(210, 250, 255, 0.5)"
            size="small">{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        width="180">
        <template slot-scope="scoped">
          {{scoped.row.category.map(item => item.name).join('/')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        sortable="custom"
        label="创建日期">
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

  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';
import elPage from './../assets/mixins/elPage.js';
import elTable from './../assets/mixins/elTable.js';
import util from './../assets/js/util.js';

export default {
  name: 'PostList',
  mixins: [elTab, elPage, elTable],
  data () {
    return {
      list: [],
      tagList: [],
      categoryList: [],

      filter: {
        tag: '',
        category: [],
        dateOrder: '',
        title: '',
        status: ''
      }
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
  watch: {
    filter: {
      deep: true,
      handler() {
        this.getList();
      }
    }
  },
  created () {
    this.addTab('文章列表', '/post');
    this.getList();
    this.getTags();
    this.getCategories();
  },
  methods: {
    async getList() {
      const { tag, category, dateOrder, title, status } = this.filter;
      const params = {
        page: this.curPage,
        size: this.pageSize
      }
      if (category.length > 0) {
        params.category = category[category.length - 1]
      }
      tag && (params.tag = tag);
      dateOrder && (params.dateOrder = dateOrder);
      title && (params.title = title);
      status && (params.publishStatus = status);

      try {
        const { sources, total } = await this.api.getPost(params);
        this.list = sources;
        this.total = total;
      } catch (error) {
        console.log(error);
      }
    },
    async getTags() {
      try {
        const { sources } = await this.api.getTags();
        this.tagList = sources;
      } catch (error) {
        console.error(error);
      }
    },
    async getCategories() {
      try {
        const { sources } = await this.api.getCategory();
        sources.push({
          _id: '0',
          pId: '-1',
          name: '全部'
        });
        this.categoryList = util.list2tree(sources, '0', {
          id: '_id',
          pId: 'pId',
          label: 'name'
        })[0].children || [];
        this.categoryList.push({
          _id: 'nocategory',
          pId: '0',
          name: '未分类'
        });
      } catch (error) {
        console.error(error);
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
              this.removePostTab(ids);
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
    removePostTab(ids) {
      const routes = ids.map(id => '/post/edit/' + id);
      this.$store.commit('removeTabsByRoute', routes);
    },
    editItem() {
      const id = this.curSelect[0]._id;
      this.$router.push('/post/edit/' + id);
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
</style>
