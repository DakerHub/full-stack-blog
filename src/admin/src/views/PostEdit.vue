<template>
  <div class="post-edit">
    <div class="vertical-center padding-b-20">
      <label class="short-label" for="postTitle">标题</label>
      <el-input
        id="postTitle"
        class="post-title"
        v-model="title"
        clearable />
    </div>
    <div class="vertical-center padding-b-20">
      <label class="short-label" for="postAbstract">摘要</label>
      <el-input
        id="postAbstract"
        class="post-abstract"
        v-model="abstract"
        type="textarea" />
    </div>
    <div class="padding-b-20">
      <mavon-editor v-model="content" />
    </div>
    <div class="vertical-center padding-b-20">
      <label class="short-label" for="postTitle">标签</label>
      <el-select
        v-model="tagsSelected"
        multiple
        placeholder="请选择标签">
        <el-option
          v-for="tag in tagList"
          :key="tag._id"
          :label="tag.name"
          :value="tag._id">
        </el-option>
      </el-select>
    </div>
    <div class="vertical-center padding-b-20">
      <label class="short-label" for="postCategory">分类</label>
      <el-cascader
        id="postCategory"
        v-model="category"
        :options="categoryList"
        :props="{value:'_id','label':'name',children:'children'}"
        clearable
        placeholder="请选择分类" />
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
import util from './../assets/js/util.js';

export default {
  name: 'PostEdit',
  mixins: [elTab],
  data() {
    return {
      title: '',
      content: '',
      abstract: '',
      tagsSelected: [],
      category: [],
      _id: '',

      tagList: [],
      categoryList: [],

      modified: false,
      submiting: false
    };
  },
  computed: {
    disabled() {
      return !(this.title && this.content && this.abstract);
    },
    postId() {
      return this.$route.params.id;
    }
  },
  watch: {
    title(title) {
      this.modified = true
    },
    content() {
      this.modified = true
    },
    abstract() {
      this.modified = true
    },
    tagsSelected() {
      this.modified = true
    },
    '$route.path'() {
      this.getPost();
      this.modified = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getPost();
      vm.modified = false;
    })
  },
  beforeRouteUpdate(to, from, next) {
    console.log(111);
    this.confirmLeave(to, from, next);
  },
  beforeRouteLeave(to, from, next) {
    this.confirmLeave(to, from, next);
  },
  created() {
    this.addTab('编辑文章', this.$route.fullPath);
    this.getTags();
    this.getCategories();
  },
  methods: {
    async submit() {
      const params = {
        title: this.title,
        content: this.content,
        abstract: this.abstract,
        tags: this.tagsSelected.join(','),
        category: this.category.join(','),
        _id: this._id
      }
      try {
        this.submiting = true;
        await this.api.editPost(params);
        this.modified = false;
        this.changeTabTitle(this.title);
      } catch (error) {
        console.error(error);
      } finally {
        this.submiting = false;
      }
    },
    async getPost() {
      const params = {
        _id: this.postId
      }
      try {
        const { sources } = await this.api.getPost(params);
        const { title, content, abstract, tags, _id, category } = sources[0];
        this.title = title;
        this.content = content;
        this._id = _id;
        this.abstract = abstract;
        this.tagsSelected = tags.map(tag => tag._id);
        this.category = category.map(cate => cate._id);
        this.changeTabTitle(title);
        this.$nextTick(() => {
          this.modified = false;
        });
      } catch (error) {
        console.error(error);
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
      } catch (error) {
        console.error(error);
      }
    },
    confirmLeave(to, from, next) {
      if (this.modified) {
        this.$msgbox({
          title: '提示',
          message: '离开此页面后，未保存的内容将被清空，请确保您已保存！是否离开？',
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
          this.$store.commit('setActivedTabByRoute', from.fullPath);
        });
      } else {
        next();
      }
    },
    changeTabTitle(title) {
      this.$store.commit('setTagNameByRoute', {
        route: this.$route.path,
        label: '>' + title + '<'
      });
    }
  }
}
</script>

<style scoped>
.post-title, .post-abstract{
  max-width: 40%;
}
.post-edit >>> .v-note-wrapper{
  min-height: 500px;
}
.post-edit{
  position: relative;
}
</style>
