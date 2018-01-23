<template>
  <article class="post-detail">
    <div
      class="post-detail-poster"
      v-if="postDetail.poster"
      :style="{backgroundImage: `url(${postDetail.poster})`}">
    </div>
    <div class="post-detail-main">
      <h1 class="post-detail-title">{{postDetail.title}}</h1>
      <div class="post-detail-mate secondary-text-color">
        <span class="post-detail-date"><i class="iconfont icon-timefull"></i>{{postDetail.date}}</span>
        <span class="post-detail-tag active-color">
          <span v-for="tag in postDetail.tags">
            <i class="iconfont icon-tag"></i>
            <router-link class="active-color" to="">{{tag.name}}</router-link>
          </span>
        </span>
      </div>
      <div class="post-detail-content">
        <VueMarkdown :source='postDetail.content' />
      </div>
    </div>
    <div class="post-detail-near">
      <router-link
        :class="{
          'post-detail-near-prev': true,
          'is-disabled': !prevPost.route
        }"
        :to="prevPost.route"
        title="上一篇">
          <i class="iconfont icon-triangle-left"></i>
          <span>{{prevPost.title}}</span></router-link>
      <router-link
        :class="{
          'post-detail-near-next': true,
          'is-disabled': !nextPost.route
        }"
        :to="nextPost.route"
        title="下一篇">
          <span>{{nextPost.title}}</span>
          <i class="iconfont icon-triangle-right"></i></router-link>
    </div>

    <PostComment
      :post-id="postId"></PostComment>

  </article>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import Prism  from 'prismjs';
import titleMixin from '../assets/util/title.mixin.js';
import PostComment from './PostDetailComment.vue';
import '../assets/css/prism.css';

export default {
  name: 'PostDetail',
  mixins: [titleMixin],
  title () {
    return this.postDetail.title;
  },
  asyncData({ store, route }) {
    return store.dispatch('getPostDetail', route.params.id);
  },
  components: {
    VueMarkdown,
    PostComment
  },
  computed: {
    postId() {
      return this.$route.params.id;
    },
    postDetail() {
      return this.$store.state.postDetail;
    },
    prevPost() {
      if (this.postDetail.prevPost) {
        return {
          title: this.postDetail.prevPost.title,
          route: `/blog/post/${this.postDetail.prevPost._id}`
        }
      }
      return {
        title: '没有啦！',
        route: ''
      }
    },
    nextPost() {
      if (this.postDetail.nextPost) {
        return {
          title: this.postDetail.nextPost.title,
          route: `/blog/post/${this.postDetail.nextPost._id}`
        }
      }
      return {
        title: '没有啦！',
        route: ''
      }
    }
  },
  mounted() {
    this.highlightCode();
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.commit('setPosition', [{
        title: 'BLOG',
        route: '/blog'
      }, {
        title: vm.postDetail.title,
        route: '',
        disabled: true
      }]);
    })
  },
  beforeRouteUpdate(to, from, next) {
    console.log(1);
    next();
  },
  methods: {
    /**
     * 设置语法高亮的HTML
     */
    highlightCode() {
      this.$nextTick(() => {
        const $codes = document.querySelectorAll('.post-detail-content code');
        $codes.forEach($code => {
          $code.innerHTML = Prism.highlight($code.innerText, Prism.languages.javascript);
        });
      });
    }
  }
}
</script>

<style scoped>
.post-detail{
  padding: 1em;
  background-color: #fff;
  box-sizing: border-box;
}
.post-detail-poster{
  width: 100%;
  height: 0;
  padding-bottom: 60%;
  background-size: cover;
}
.post-detail-title{
  font-size: 2em;
  padding: 1em 0;
}
.post-detail-mate{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1em;
}
.post-detail-content{
  padding: 1em 0;
}
.post-detail-date{
  white-space: nowrap;
  margin-right: 2em;
  margin-bottom: 5px;
}
.post-detail-tag{
  margin-bottom: 5px;
}
.post-detail-tag>span{
  margin-right: 5px;
}
.post-detail-near{
  width: 100%;
  padding-top: 1em;
  border-top: thin solid #ccc;
  display: flex;
  justify-content: space-between;
}
.post-detail-near a{
  display: flex;
  max-width: 50%;
  color: #212121;
  text-decoration: none;
  transition: color .3s;
}
.post-detail-near a:not(.is-disabled):hover{
  color: #00BCD4;
}
.post-detail-near-prev.is-disabled,.post-detail-near-next.is-disabled{
  color: #b0aeb5;
  cursor: not-allowed;
}
.post-comment{
  margin-top: 2em;
}
/* vue-markdown在组件复用时没有渲染pre的类名 */
.post-detail-content >>> pre{
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
  background: #f5f2f0;
}
</style>
<style lang="scss"  rel="stylesheet/scss">
.post-detail-content{
  @import "../assets/css/markdown.scss";
}
</style>

