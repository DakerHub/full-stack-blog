<template>
  <div class="aside-tabs-recent">
    <div class="aside-tabs-recent-inner">
      <BaseTabs
        :tabs="tabs"
        :activeTab="activeTab"
        @active-change="changeTag" />
      <ul class="aside-recent-list">
        <li v-for="i in 5">
          <div class="aside-list-poster">
            <img src="" alt="">
          </div>
          <div class="aside-list-detail">
            <h3 class="aside-list-title">asfsafa</h3>
            <span class="aside-list-meta secondary-text-color"><i class="iconfont icon-timefull"></i>2012.1.2</span>
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
  methods: {
    changeTag(tab) {

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
  height: 70px;
  display: flex;
  align-items: center;
}
.aside-list-poster{
  height: 60px;
  width: 60px;
  background-color: tomato;
  margin: 0 10px;
}
.aside-list-detail{
  height: 60px;
}
.aside-list-detail h3{
  padding: .3em 0 1em;
  font-size: 1em;
}
.aside-list-meta{
  font-size: .8em;
  display: flex;
  align-items: center;
}
.aside-list-meta .iconfont{
  font-size: .8em;
  margin-right: 5px;
}
</style>
