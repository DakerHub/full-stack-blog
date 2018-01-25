<template>
  <div class="aside-tabs-recent">
    <div class="aside-tabs-recent-inner">
      <BaseTabs
        :tabs="tabs"
        :activeTab="activeTab"
        @active-change="changeTag" />
      <ul class="aside-recent-list" v-show="activeTab === '1'">
        <li v-for="post in newestPosts">
          <div class="aside-list-poster light-2-primary-color">
            <img :src="post.poster" alt="">
          </div>
          <div class="aside-list-detail">
            <h3 class="aside-list-title">
              <router-link class="primary-text-color" :to="`/blog/post/${post._id}`">{{post.title}}</router-link>
            </h3>
            <span class="aside-list-meta secondary-text-color"><i class="iconfont icon-shijian"></i>{{post.date}}</span>
          </div>
        </li>
      </ul>
      <ul class="aside-recent-list" v-show="activeTab === '3'">
        <li v-for="item in newestComments">
          <div class="aside-list-avatar light-2-primary-color">
            <img :src="item.author.userPic" alt="">
          </div>
          <div class="aside-list-detail">
            <p class="aside-list-comment-title">
              <span
                class="aside-list-comment-username"
                :title="item.author.username">{{item.author.username}}</span>
              <span class="aside-list-comment-post secondary-text-color">
                at <router-link class="active-color" :to="`/blog/post/${item.post._id}`" :title="item.post.title">{{item.post.title}}</router-link>
              </span>
            </p>
            <div class="aside-list-comment-wp">
              <i class="iconfont icon-triangle-left"></i>
              <p class="aside-list-comment">{{item.content}}</p>
            </div>
            <p class="aside-list-comment-date secondary-text-color"><i class="iconfont icon-shijian"></i>{{item.createdDate}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import BaseTabs from './../components/BaseTabs.vue';
export default {
  name: 'AsideTabsRecent',
  data() {
    return {
      tabs: [
        {
          id: '1',
          label: '最近文章'
        },
        {
          id: '2',
          label: '热门文章'
        },
        {
          id: '3',
          label: '最近评论'
        }
      ],
      activeTab: '1',
      list: []
    };
  },
  components: {
    BaseTabs
  },
  computed: {
    newestPosts() {
      return this.$store.state.newestPosts;
    },
    newestComments() {
      return this.$store.state.newestComments;
    }
  },
  methods: {
    changeTag(tab) {
      this.activeTab = tab.id;
    }
  }
}
</script>
<style scoped>
.aside-tabs-recent-inner{
  max-width: 600px;
  margin: 0 auto;
  padding: 1em;
  background-color: #fff;
  box-sizing: border-box;
}
.aside-recent-list{
  margin-top: 1em;
}
.aside-recent-list li{
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.aside-list-detail{
  margin-right: 5px;
}
.aside-list-title a{
  text-decoration: none;
  transition: color .3s ease;
}
.aside-list-title a:hover{
  color: #00BCD4 !important;
}
.aside-list-poster{
  height: 60px;
  width: 91.76px;
  margin: 0 10px;
  text-align: center;
  overflow: hidden;
}
.aside-list-poster img{
  width: 100%;
}
.aside-list-title{
  padding: .3em 0 1em;
  font-size: 1em;
}
.aside-list-title a{
  display: block;
  max-width: 10em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.aside-list-meta{
  font-size: .8em;
}
.aside-list-meta .iconfont{
  font-size: 1em;
}
.aside-list-avatar{
  width: 40px;
  height: 40px;
  margin: 0 10px;
  border: 2px solid #673AB7;
  border-radius: 50%;
  overflow: hidden;
  background-image: url('/static/avatar/default_avatar.png');
  background-size: contain;
  flex-shrink: 0;
}
.aside-list-avatar img{
  height: 100%;
  width: 100%;
}
.aside-list-comment-title{
  font-size: 1em;
  line-height: 1.4em;
  margin-bottom: 4px;
}
.aside-list-comment-username{
  display: inline-block;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.aside-list-comment-post{
  display: inline-block;
  max-width: 140px;
  font-size: .8em;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  vertical-align: middle;
}
.aside-list-comment-post a{
  line-height: 1.4em;
  text-decoration: none;
}
.aside-list-comment-post a:hover{
  text-decoration: underline;
}
.aside-list-comment-date{
  font-size: .8em;
  margin-top: 5px;
}
.aside-list-comment-date i{
  font-size: 1em;
}
.aside-list-comment{
  font-size: .8em;
  display: block;
  word-break: break-all;
  max-height: 2.8em;
  line-height: 1.4em;
  text-overflow: ellipsis;
  color: #fff;
  overflow: hidden;
}
.aside-list-comment-wp{
  position: relative;
  background-color: #361179;
  padding: .5em;
  border-radius: 4px;
}
.aside-list-comment-wp .icon-triangle-left{
  position: absolute;
  left: -.7em;
  top: 4px;
  color: #361179;
}
</style>
