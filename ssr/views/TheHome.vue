<template>
  <section class="fcc-home">
    <div class="fcc-home-post-filter" v-if="queryTag">
      根据标签过滤：<span class="active-color">{{tagName}}</span>
      <button
        class="fcc-home-post-filter-clear"
        data-type="text"
        @click="clearTagQuery">
        <i class="iconfont icon-close"></i>
      </button>
    </div>
    <div class="fcc-home-post-list">
      <ul>
        <li
          class="fcc-home-post secondary-text-color" 
          v-for="post in posts"
          :key="post._id">
          <div
            class="fcc-home-post-poster light-2-primary-color"
            :style="{
              backgroundImage: `url(${post.poster||''})`
            }">
          </div>
          <div class="fcc-home-post-wp">
            <h2 class="fcc-home-post-title p1em">
              <router-link :to="`/blog/post/${post._id}`" class="primary-text-color">{{post.title}}</router-link>
            </h2>
            <p class="fcc-home-post-abs p1em">{{post.abstract}}</p>
            <ul class="fcc-home-post-tag p1em active-color">
              <li
                title="标签"
                v-for="tag in post.tags"
                :key="tag._id">
                <i class="iconfont icon-tag"></i>
                <router-link :to="`/blog?tag=${tag._id}`" class="active-color fcc-home-post-tag-link">{{tag.name}}</router-link>
              </li>
            </ul>
            <div class="fcc-home-post-mate">
              <span class="fcc-home-post-date" title="文章发布日期">
                <i class="iconfont icon-calendar2"></i><time>{{post.date}}</time>
              </span>
              <span class="fcc-home-post-comment-count" title="评论数">
                <i class="iconfont icon-comment"></i><span>{{post.commentCount}}</span>
              </span>
              <span title="浏览量">
                <i class="iconfont icon-liulan1"></i><span>{{post.viewCount||0}}</span>
              </span>
            </div>
          </div>
        </li>
      </ul>
      <BasePagination
        :total="postsTotal"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="changeCurrent">
      </BasePagination>
    </div>
  </section>
</template>

<script>
import BasePagination from './../components/BasePagination.vue';
import titleMixin from '../assets/util/title.mixin.js';

export default {
  name: 'TheHome',
  mixins: [titleMixin],
  data() {
    return {
    };
  },
  title () {
    return 'FBLOG';
  },
  asyncData ({ store, route }) {
    const currentPage = Number.parseInt(route.query && route.query.page || 1);
    const pageSize = Number.parseInt(route.query && route.query.size || 10);
    const tagId = route.query && route.query.tag;
    const params = {
      page: currentPage,
      size: pageSize,
      tag: tagId
    };
    const promises = [store.dispatch('getPosts', params)];

    if (tagId) {
      promises.push(store.dispatch('getTagName', tagId));
    }

    return Promise.all(promises);
  },
  components: {
    BasePagination
  },
  computed: {
    posts () {
      return this.$store.state.posts;
    },
    tagName() {
      return this.$store.state.queryTagName;
    },
    postsTotal () {
      return this.$store.state.postsTotal;
    },
    pageSize() {
      return Number.parseInt(this.$route.query && this.$route.query.size || 10);
    },
    currentPage() {
      return Number.parseInt(this.$route.query && this.$route.query.page || 1);
    },
    queryTag() {
      return this.$route.query && this.$route.query.tag;
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.commit('setPosition', [{
        title: 'BLOG',
        route: '/blog'
      }]);
    })
  },
  methods: {
    changeCurrent(val) {
      const query = Object.assign({}, this.$route.query);
      query.page = val;
      this.$router.push({ path: 'blog', query });
    },
    clearTagQuery() {
      const query = Object.assign({}, this.$route.query);
      delete query.tag;
      this.$router.push({ path: 'blog', query });
    }
  }
}
</script>

<style scoped>
.fcc-home{
  padding-top: 0;
  padding-bottom: 0;
}
.fcc-home-post-filter{
  max-width: 800px;
  margin: 0 auto;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}
.fcc-home-post-filter-clear{
  float: right;
  color: #8c8c8c;
  transition: color .3s;
}
.fcc-home-post-filter-clear:hover{
  color: #212121;
}
.fcc-home-post-list{
  max-width: 800px;
  margin: 0 auto;
}
@media screen and (max-width: 1023px) {
  .fcc-home-post-list{
    padding: 0 1em;
  }
}
.fcc-home-post{
  padding: .5em 1em 1em 1em;
  margin-bottom: 1em;
  background-color: #fff;
  border-radius: 4px;
  /* box-shadow: 0 0 7px 0px rgba(36, 0, 101, 0.2); */
}
.fcc-home-post-poster{
  height: 0px;
  width: 100%;
  padding-bottom: 60%;
  background-color: #ccc;
  background-position: center top;
  background-repeat: no-repeat;
  -webkit-background-size:cover;
  -moz-background-size:cover;
  background-size:cover;
  text-align: center;
  overflow: hidden;
}
@media screen and (min-width: 520px) {
  .fcc-home-post-poster{
    display: inline-flex;
    vertical-align: top;
    width: 260px;
    height: 170px;
    padding: 0;
    margin-right: 10px;
  }
  .fcc-home-post-wp{
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 270px);
  }
}
.fcc-home-post-title{
  padding: 5px 0;
  font-size: 1em;
  max-width: 12em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.fcc-home-post-title a{
  font-weight: bold;
  text-decoration: none;
  transition: color .3s ease;
}
.fcc-home-post-title a:hover{
  color: #00BCD4 !important;
}
.fcc-home-post-abs{
  font-size: .9em;
  line-height: 1.4em;
}
@media screen and (max-width: 375px) {
  .fcc-home-post-abs{
    display: none;
  }
}
.fcc-home-post-date{
  margin-right: 1em;
}
.fcc-home-post-comment-count{
  margin-right: 1em;
}
.fcc-home-post-tag{
  display: flex;
  font-size: .8em;
  line-height: 1.2em;
}
.fcc-home-post-tag li{
  margin-right: 10px;
}
.fcc-home-post-tag-link{
  text-decoration: none;
}
.fcc-home-post-tag-link:hover{
  text-decoration: underline;
}
.p1em{
  margin-bottom: 1em;
}
.fcc-home-post-mate{
  display: flex;
  align-items: center;
  font-size: .8em;
  line-height: 1.2em;
}
</style>

