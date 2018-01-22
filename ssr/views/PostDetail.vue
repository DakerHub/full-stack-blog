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
  </article>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import Prism  from 'prismjs';
import titleMixin from '../assets/util/title.mixin.js';
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
    VueMarkdown
  },
  computed: {
    postId() {
      return this.$route.params.id;
    },
    postDetail() {
      return this.$store.state.postDetail;
    }
  },
  mounted() {
    this.highlightCode();
  },
  updated() {
    console.log(11111111);
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

