<template>
  <section class="fcc-home">
    <div class="fcc-home-post-list">
      <ul>
        <li
          class="fcc-home-post secondary-text-color" 
          v-for="post in posts"
          :key="post._id">
          <div class="fcc-home-post-poster">
            <img src="" alt="">
          </div>
          <div class="fcc-home-post-wp">
            <h2 class="fcc-home-post-title p1em primary-text-color">{{post.title}}</h2>
            <p class="fcc-home-post-abs p1em">{{post.abstract}}</p>
            <ul class="fcc-home-post-tag p1em active-color">
              <li
                v-for="tag in post.tags"
                :key="tag._id">
                <i class="iconfont icon-tag"></i>
                {{tag.name}}
              </li>
            </ul>
            <span class="fcc-home-post-date p1em">
              <i class="iconfont icon-timefull"></i>{{post.date}}
            </span>
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

export default {
  name: 'TheHome',
  data() {
    return {
    }
  },
  components: {
    BasePagination
  },
  asyncData ({ store, route }) {
    const currentPage = Number.parseInt(route.query && route.query.page || 1);
    const pageSize = Number.parseInt(route.query && route.query.size || 10);
    const params = {
      page: currentPage,
      size: pageSize
    };
    return store.dispatch('getPosts', params);
  },
  computed: {
    posts () {
      return this.$store.state.posts;
    },
    postsTotal () {
      return this.$store.state.postsTotal;
    },
    pageSize() {
      return Number.parseInt(this.$route.query && this.$route.query.size || 10);
    },
    currentPage() {
      return Number.parseInt(this.$route.query && this.$route.query.page || 1);
    }
  },
  methods: {
    changeCurrent(val) {
      this.$router.push(`/blog?page=${val}`);
    }
  }
}
</script>

<style scoped>
.fcc-home{
  padding: 1em;
}
.fcc-home-post-list{
  max-width: 800px;
  margin: 0 auto;
}
.fcc-home-post{
  padding: .5em 1em 1em 1em;
  margin-bottom: 1em;
  background-color: #fff;
  border-radius: 4px;
  /* box-shadow: 0 0 7px 0px rgba(36, 0, 101, 0.2); */
}
.fcc-home-post-poster{
  width: 100%;
  padding-top: 65%;
  background-color: #ccc;
}
@media screen and (min-width: 520px) {
  .fcc-home-post-poster{
    display: inline-block;
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
.fcc-home-post-abs{
  font-size: .9em;
}
@media screen and (max-width: 375px) {
  .fcc-home-post-abs{
    display: none;
  }
}
.fcc-home-post-date{
  display: flex;
  font-size: .8em;
  line-height: 1.2em;
}
.fcc-home-post-tag{
  display: flex;
  font-size: .8em;
  line-height: 1.2em;
}
.fcc-home-post-tag li{
  display: inline-flex;
  margin-right: 10px;
}
.fcc-home-post-tag .iconfont, .fcc-home-post-date .iconfont{
  margin-right: 5px;
  font-size: .8em;
}
.p1em{
  margin-top: 1em;
}
</style>

