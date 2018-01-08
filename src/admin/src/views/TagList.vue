<template>
  <div>
    <div class="tags-oprate">
      <el-input v-model="tagName" clearable />
      <el-button
        class="tags-oprete-btn"
        type="primary"
        :loading="submting"
        :disabled="!tagName"
        @click="addTag">{{tagSelect._id?'修改':'添加'}}</el-button>
    </div>
    <div class="tags-wp">
      <el-tag
        :class="{'is-selected': item._id===tagSelect._id}"
        v-for="(item, index) in list"
        closable
        :key="item._id"
        color="rgba(210, 250, 255, 0.5)"
        @close="handleClose(item, index)"
        @click.native="clickTag(item)">
        {{item.name}}
        <i class="el-icon-loading" v-show="loadingTag === item._id"></i>
      </el-tag>
    </div>
  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';

export default {
  name: 'TagList',
  mixins: [elTab],
  data() {
    return {
      list: [],

      tagName: '',
      tagSelect: {},

      loadingTag: '',
      submting: false
    };
  },
  methods: {
    async getList() {
      try {
        const { sources } = await this.api.getTags();
        this.list = sources;
      } catch (error) {
        console.error(error);
      }
    },
    async handleClose(tag, index) {
      if (this.loadingTag) {
        return;
      }

      this.loadingTag = tag._id;
      try {
        await this.api.delTag({ ids: tag._id });
        this.list.splice(index, 1);

      } catch (error) {
        console.error(error);
      } finally {
        this.loadingTag = '';
      }
    },
    async addTag() {
      this.submting = true;
      const params = {
        name: this.tagName
      }
      try {
        if (this.tagSelect._id) {
          params._id = this.tagSelect._id;
          const { source } = await this.api.editTag(params);
          this.tagSelect.name = this.tagName;
        } else {
          const { source } = await this.api.newTag(params);
          if (source) {
            this.list.push(source);
            this.tagName = '';
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.submting = false;
      }
    },
    clickTag(tag) {
      if (this.tagSelect._id === tag._id) {
        this.tagSelect = {};
        this.tagName = '';
      } else {
        this.tagSelect = tag;
        this.tagName = tag.name;
      }
    }
  },
  created () {
    this.addTab('标签列表', '/tag');
    this.getList();
  }
}
</script>

<style scoped>
.tags-oprate{
  width: 50%;
  display: flex;
  margin-bottom: 20px;
}
.tags-oprete-btn{
  margin-left: 10px;
}
.el-tag+.el-tag{
  margin-left: 10px;
}
.el-tag{
  cursor: pointer;
}
.el-tag:hover, .el-tag.is-selected{
  border-color: #00BCD4;
}
</style>
