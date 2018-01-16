<template>
  <div class="fcc-home">
    <section class="fcc-home-post-wp">
      <ul>
        <li
          class="fcc-home-post secondary-text-color" 
          v-for="post in posts"
          :key="post._id">
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
        </li>
      </ul>
      <BasePagination
        :total="100"
        :current-page="1"
        :page-size="10"></BasePagination>
    </section>

  </div>
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
    return store.dispatch('getRecentPost');
  },
  computed: {
    posts () {
      return this.$store.state.posts
    }
  }
}
</script>

<style scoped>
.fcc-home{
  padding: 1em;
}
.fcc-home-post{
  padding: .5em 1em 1em 1em;
  margin-bottom: 1em;
  background-color: #fff;
  border-radius: 4px;
  /* box-shadow: 0 0 7px 0px rgba(36, 0, 101, 0.2); */
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

