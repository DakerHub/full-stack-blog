<template>
  <div class="fcc-page light-2-primary-color">
    <header class="fcc-header default-primary-color">
      <div class="fcc-header-avatar" @click="sidebarShow = true"></div>
    </header>

    <transition name="slide-right">
      <aside class="fcc-sidebar" v-show="sidebarShow">
        <div class="fcc-sidebar-avatar"></div>
        <nav class="fcc-sidebar-nav">
          <ul>
            <li v-for="route in routes" :key="route.name">
              <router-link
                :class="{'active-color':activeRoute === route.route}"
                :to="route.route">
                {{route.name}}
                <span class="active-bg-color"></span>
              </router-link>
            </li>
          </ul>
          <ul class="fcc-sidebar-outlink">
            <li><a href=""><i class="iconfont icon-github"></i></a></li>
            <li><i class="iconfont icon-mail"></i></li>
          </ul>
        </nav>
      </aside>
    </transition>

    <main class="fcc-main">
      <transition name="fade" mode="out-in">
        <router-view class="fcc-view primary-text-color" />
      </transition>

      <aside class="fcc-right">
        <AsideTabsRecent></AsideTabsRecent>
      </aside>
    </main>

    <TheLabelFooter></TheLabelFooter>

    <TheFooter></TheFooter>
    
    <transition name="fade">
      <div
        class="fcc-mask"
        v-show="sidebarShow"
        @click="sidebarShow = false" />
    </transition>
  </div>
</template>

<script>
import AsideTabsRecent from './AsideTabsRecent.vue';
import TheLabelFooter from './TheLabelFooter.vue';
import TheFooter from './TheFooter.vue';

export default {
  name: 'TheMain',
  data() {
    return {
      sidebarShow: false,
      routes: [
        {
          name: 'BLOG',
          route: '/blog'
        },
        {
          name: '画廊',
          route: '/blog/gallery'
        },
        {
          name: '关于',
          route: '/blog/about'
        }
      ]
    };
  },
  asyncData ({ store, route }) {
    return store.dispatch('getTags');
  },
  components: {
    AsideTabsRecent,
    TheLabelFooter,
    TheFooter
  },
  computed: {
    activeRoute() {
      return this.$route.path;
    }
  },
  watch: {
    '$route.path'() {
      this.sidebarShow = false;
    },
    sidebarShow(show) {
      if (show) {
        document.querySelector('body').style.overflow = 'hidden';
      } else {
        document.querySelector('body').style.overflow = 'auto';
      }
    }
  }
}
</script>

<style scoped>
.fcc-page{
  min-height: 100%;
}
.fcc-main{
  max-width: 1100px;
  margin: 0 auto;
}
.fcc-header{
  height: 4em;
  width: 100%;
}
.fcc-header-avatar{
  height: 3em;
  width: 3em;
  margin: .5em 1em;
  border-radius: 50%;
  background-color: #fff;
  float: right;
}
.fcc-sidebar-avatar{
  height: 6em;
  width: 6em;
  margin: 2em auto;
  border-radius: 50%;
  background-color: #673AB7;
}
.fcc-sidebar{
  position: fixed;
  top: 0px;
  right: 0px;
  height: 100%;
  width: 80%;
  background-color: #fff;
  z-index: 999;
}
@media screen and (min-width: 520px) {
  .fcc-sidebar{
    width: 300px;
  }
}
.fcc-sidebar-nav{
  height: calc(100% - 8em);
  padding-top: 2em;
  background-color: #673AB7;
}
.fcc-sidebar-nav a{
  color: #fff;
  text-decoration: none;
}
.fcc-sidebar-nav li{
  height: 4em;
  line-height: 4em;
  text-align: center;
}
.fcc-sidebar-outlink{
  position: absolute;
  width: 100%;
  bottom: 0px;
  color: #fff;
  text-align: center;
}
.fcc-sidebar-outlink li{
  display: inline-block;
  padding: 0 20px;
}
.fcc-view{
  box-sizing: border-box;
  width: 100%;
}
.fcc-right{
  padding: 1em;
  box-sizing: border-box;
  width: 100%;
}
@media screen and (min-width: 1024px) {
  .fcc-right{
    display: inline-block;
    vertical-align: top;
    width: 360px;
  }
  .fcc-view{
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 400px);
  }
}

.fcc-mask{
  position: fixed;
  top: 0px;
  right: 0px;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, .2);
}
.active-color .active-bg-color{
  width: .5em;
  height: 100%;
  display: block;
  float: right;
}
</style>

