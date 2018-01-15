<template>
  <div class="fcc-home">
    <ul>
      <li
        class="fcc-home-post" 
        v-for="post in posts"
        :key="post._id">
        <h2 class="fcc-home-post-title p1em">{{post.title}}</h2>
        <p class="fcc-home-post-abs p1em">{{post.abstract}}</p>
        <ul class="fcc-home-post-tag p1em">
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
  </div>
</template>

<script>
export default {
  name: 'TheHome',
  data() {
    return {
      name: 'fengcc'
    }
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
  color: #757575;
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
  color: #212121;
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
  color: #00BCD4;
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

