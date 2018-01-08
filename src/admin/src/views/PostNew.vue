<template>
  <div class="post-new">
    <div class="vertical-center padding-b-20">
      <label class="short-label" for="postTitle">标题</label>
      <el-input id="postTitle" class="post-title" v-model="title" clearable></el-input>
    </div>
    <div class="vertical-center padding-b-20">
      <label class="short-label" for="postAbstract">摘要</label>
      <el-input
        id="postAbstract"
        class="post-abstract"
        v-model="abstract"
        type="textarea"></el-input>
    </div>
    <div class="padding-b-20">
      <mavon-editor v-model="content"/>
    </div>
    <div class="vertical-center padding-b-20">
      <label class="short-label" for="postTitle">标签</label>
      <el-select v-model="tagsSelected" multiple placeholder="请选择标签">
        <el-option
          v-for="tag in tagList"
          :key="tag._id"
          :label="tag.name"
          :value="tag._id">
        </el-option>
      </el-select>
    </div>
    <el-button
      class="post-save-btn"
      type="primary"
      :disabled="disabled"
      :loading="submiting"
      @click="submit">保存</el-button>
  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';

export default {
  name: 'PostNew',
  mixins: [elTab],
  data() {
    return {
      title: '',
      content: '',
      abstract: '',
      tagsSelected: [],

      tagList: [],

      submiting: false
    };
  },
  computed: {
    disabled() {
      return !(this.title && this.content && this.abstract);
    }
  },
  beforeRouteLeave(to, from, next) {
    // ...
    if (this.title || this.content || this.abstract) {
      this.$msgbox({
        title: '提示',
        message: '离开此页面后，所填写的内容将被清空，请确保您已保存！是否离开？',
        showCancelButton: true,
        confirmButtonText: '我要走别拦我！',
        cancelButtonText: '好吧，留下来',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            next();
          }
          done();
        }
      }).catch(() => {
        this.$store.commit('setActivedTabByRoute', '/post/new');
      });
    } else {
      next();
    }
  },
  methods: {
    async submit() {
      const params = {
        title: this.title,
        content: this.content,
        abstract: this.abstract,
        tags: this.tagsSelected.join(',')
      }
      try {
        this.submiting = true;
        await this.api.newPost(params);
      } catch (error) {
        console.error(error);
      } finally {
        this.submiting = false;
      }
    },
    async getTags() {
      try {
        const { sources } = await this.api.getTags();
        this.tagList = sources;
      } catch (error) {
        console.error(error);
      }
    }
  },
  created() {
    this.addTab('新建文章', '/post/new');
    this.getTags();
  }
}
</script>

<style scoped>
.post-title, .post-abstract{
  max-width: 40%;
}
.post-new >>> .v-note-wrapper{
  min-height: 500px;
}
.post-new{
  position: relative;
}
</style>
