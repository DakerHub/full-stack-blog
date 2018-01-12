<template>
  <div>
    <el-button-group class="post-list-btns box-content">
      <el-button
        :disabled="disabled.reply"
        type="primary"
        @click="commentReplyShow = true">
        <i class="iconfont icon-huifu"></i>
        回复
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
      :value="filter.content"
      prefix-icon="el-icon-search"
      placeholder="输入内容关键词"
      @change="val => filter.content = val">
      <i
        class="el-input__icon el-icon-circle-close"
        slot="suffix"
        v-show="filter.content !== ''"
        @click="filter.content = ''" />
    </el-input>
    
    <el-table
      class="box-content"
      :data="list"
      :height="500"
      :row-class-name="tableRowClass"
      :show-overflow-tooltip="true"
      size="small"
      style="width: 100%"
      @row-click="tableRowClick"
      @sort-change="tabelSortChange">
      <el-table-column
        prop="post.title"
        label="评论主题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="author.username"
        label="评论者"
        width="80">
      </el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        width="180">
      </el-table-column>
      <el-table-column
        prop="replyTo.username"
        label="回复给"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createdDate"
        sortable="custom"
        label="评论日期">
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

    <CommentReply
      v-if="commentReplyShow"
      :target-comment="curSelect[0]"
      :show.sync="commentReplyShow"
      @update-list="getList"></CommentReply>
  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';
import elPage from './../assets/mixins/elPage.js';
import elTable from './../assets/mixins/elTable.js';
import util from './../assets/js/util.js';
import CommentReply from './ModelCommentReply';

export default {
  name: 'CommentList',
  mixins: [elTab, elPage, elTable],
  data () {
    return {
      list: [],
      tagList: [],
      categoryList: [],

      filter: {
        dateOrder: '',
        content: '',
        status: ''
      },
      commentReplyShow: false
    };
  },
  components: {
    CommentReply
  },
  computed: {
    disabled() {
      const result = {
        reply: false,
        del: false
      };
      const curSelect = this.curSelect;
      switch (curSelect.length) {
        case 0:
          result.reply = true;
          result.del = true;
          break;
        case 1:
          break;
        default:
          result.reply = true;
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
    this.addTab('评论列表', '/comment');
    this.getList();
  },
  methods: {
    async getList() {
      this.clearRowSelect();
      const { dateOrder, content } = this.filter;
      const params = {
        page: this.curPage,
        size: this.pageSize
      }
      dateOrder && (params.dateOrder = dateOrder);
      content && (params.content = content);
      
      try {
        const { sources, total } = await this.api.getComment(params);
        this.list = sources;
        this.total = total;
      } catch (error) {
        console.log(error);
      }
    },
    delItem() {
      const ids = this.curSelect.map(item => item._id).join(',');
      this.$msgbox({
        title: '提示',
        message: '删除评论可能会删除相关评论，确认删除？',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await this.api.delComment({ ids });
              this.getList();
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
.icon-huifu{
  height: 12px;
  width: auto;
  font-size: 12px;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}
</style>
