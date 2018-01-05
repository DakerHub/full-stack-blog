<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button type="primary" icon="el-icon-share"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>
    </el-button-group>

    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="作者"
        width="180">
      </el-table-column>
      <el-table-column
        label="发布状态">
        <template slot-scope="scoped">
          {{{'1': '公开', '2': '私有'}[scoped.row.publishStatus]}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';

export default {
  name: 'PostList',
  mixins: [elTab],
  data () {
    return {
      list: []
    }
  },
  methods: {
    async getList() {
//       abstract
// category
// date
// publishStatus
// tags
// title
// _id
      try {
        const { sources, total } = await this.api.getPost();
        this.list = sources;
      } catch (error) {
        console.log(error);
      }
    }
  },
  created () {
    this.addTab('文章列表', '/post');
    this.getList();
  }
}
</script>

<style scoped>

</style>
