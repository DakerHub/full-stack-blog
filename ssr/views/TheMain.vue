<template>
  <div class="fcc-page light-2-primary-color">
    <header class="fcc-header default-primary-color">
      <i class="iconfont icon-sousuo fcc-header-search light-text-color" title="搜索" @click="searchShow=true"></i>
      <i class="iconfont icon-weibiaoti12 fcc-header-menu-trigger light-text-color" @click="sidebarShow = true"></i>
      <transition name="slide-right">
        <section class="fcc-nav" v-show="sidebarShow">
          <div class="fcc-nav-user-info">
            <div class="fcc-nav-avatar"></div>
            <p class="fcc-nav-login light-text-color">
              <router-link class="light-text-color" to="">登录</router-link>
              / 
              <router-link class="light-text-color" to="">注册</router-link>
            </p>
          </div>
          <nav class="fcc-nav-list">
            <ul>
              <li v-for="route in routes" :key="route.name">
                <router-link
                  :class="{
                    'active-color':activeRoute === route.route,
                    'light-text-color': true
                  }"
                  :to="route.route">
                  {{route.name}}
                  <span class="active-bg-color"></span>
                </router-link>
              </li>
            </ul>
            <ul class="fcc-nav-outlink">
              <li><a href=""><i class="iconfont icon-github"></i></a></li>
              <li><i class="iconfont icon-mail"></i></li>
            </ul>
          </nav>
        </section>
      </transition>
    </header>

    <transition name="zoom-in">
      <div class="fcc-search-wp" v-show="searchShow">
        <input class="fcc-search-input" type="text" placeholder="输入关键词">
        <i
          class="iconfont icon-close fcc-search-close light-text-color"
          @click="searchShow=false"></i>
      </div>
    </transition>

    <main class="fcc-main">

      <MainBreadcrumb />

      <transition name="fade" mode="out-in">
        <router-view class="fcc-view primary-text-color" />
      </transition>

      <aside class="fcc-right">
        <RecentTabs />
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
import RecentTabs from './MainAsideRecentTabs.vue';
import MainBreadcrumb from './MainBreadcrumb.vue';
import TheLabelFooter from './TheLabelFooter.vue';
import TheFooter from './TheFooter.vue';

export default {
  name: 'TheMain',
  data() {
    return {
      sidebarShow: false,
      searchShow: false,
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
  asyncData({ store, route }) {
    return Promise.all([
      store.dispatch('getNewestPosts'),
      store.dispatch('getTags'),
      store.dispatch('getNewestComments')
    ]);
  },
  components: {
    RecentTabs,
    MainBreadcrumb,
    TheLabelFooter,
    TheFooter
  },
  computed: {
    activeRoute() {
      let activeRoute;
      const path = this.$route.path.split('/').filter(Boolean);
      if (path.length === 1 || (path[1] !== 'gallery' && path[1] !== 'gallery')) {
        activeRoute = '/blog';
      } else {
        activeRoute = `/${path[0]}/${path[1]}`
      }
      return activeRoute;
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
  position: relative;
  height: 4em;
  width: 100%;
}
.fcc-header-menu-trigger{
  font-size: 2em;
  margin: .5em;
  float: right;
  cursor: pointer;
}
.fcc-header-search{
  position: absolute;
  right: 2em;
  display: flex;
  font-size: 2em;
  margin: .5em 0;
  align-items: center;
  color: rgba(255, 255, 255, .7);
  cursor: pointer;
  transition: color .3s ease;
}
.fcc-header-search:hover{
  color: #fff !important;
}
.fcc-search-wp{
  position: relative;
  width: 100%;
  height: 4em;
  z-index: 1;
}
.fcc-search-input{
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 2em;
  padding-left: 2em;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid #673ab7;
  background-color: #2b155d;
  outline: none;
  color: rgba(255, 255, 255, .7);
}
.fcc-search-input::-webkit-input-placeholder{
  color: rgba(255, 255, 255, .7);
}
.fcc-search-close{
  position: absolute;
  display: flex;
  align-items: center;
  right: 1em;
  top: 0;
  color: #fff;
  font-size: 2em;
  margin: .5em 0;
  cursor: pointer;
  transition: color .3s ease;
}
.fcc-search-close:hover{
  color: #fff !important;
}
@media screen and (min-width: 1024px) {
  .fcc-header-search{
    right: 220px;
    font-size: .8em;
    margin: 2em 0;
  }
  .fcc-search-input{
    padding-left: 4em;
  }
}
.fcc-nav{
  position: fixed;
  top: 0px;
  right: 0px;
  height: 100%;
  width: 80%;
  background-color: #fff;
  background-image: url('/static/img/avatar_bg.jpg');
  background-size: 100%;
  box-shadow: rgba(30, 10, 64, 0.4) 0px 0px 11px 5px;
  overflow: hidden;
  z-index: 999;
}
@media screen and (min-width: 520px) and (max-width: 1024px) {
  .fcc-nav{
    width: 300px;
  }
}
.fcc-nav-avatar{
  height: 6em;
  width: 6em;
  margin: 1em auto;
  border: 4px solid #673AB7;
  border-radius: 50%;
  background-color: #fff;
  background-image: url('/static/avatar/default_avatar.png');
  background-size: contain;
}
.fcc-nav-login{
  text-align: center;
  color: #fff;
  margin-bottom: 1em;
}
.fcc-nav-login a{
  color: #fff;
  text-decoration: none;
  transition: color .3s ease;
}
.fcc-nav-login a:hover{
  color: #fff !important;
}
.fcc-nav-list{
  height: calc(100% - 8em);
  padding-top: 2em;
  background-color: #673AB7;
}
.fcc-nav-list a{
  color: #fff;
  text-decoration: none;
  transition: color .3s ease;
}
.fcc-nav-list a:hover{
  color: #fff !important;
}
.fcc-nav-list li{
  height: 4em;
  line-height: 4em;
  text-align: center;
}
.fcc-nav-outlink{
  position: absolute;
  width: 100%;
  bottom: 0px;
  color: #fff;
  text-align: center;
}
.fcc-nav-outlink li{
  display: inline-block;
  padding: 0 20px;
}
@media screen and (min-width: 1024px) {
  .fcc-nav{
    position: relative;
    display: block !important;
    width: 100%;
    background-color: transparent;
    background-image: none;
  }
  .fcc-header-search{
    z-index: 1000;
  }
  .fcc-nav-user-info{
    position: absolute;
    right: 0px;
    display: flex;
    align-items: center;
    height: 100%;
    width: 200px;
  }
  .fcc-nav-avatar{
    height: 3em;
    width: 3em;
    margin: 0;
  }
  .fcc-nav-list{
    height: 100%;
    padding: 0;
    text-align: center;
    background-color: transparent;
  }
  .fcc-nav-list li{
    display: inline-block;
    position: relative;
    padding: 0 20px;
  }
  .fcc-nav-outlink{
    display: none;
  }
  .fcc-nav-login{
    margin: 0 10px;
    font-size: .6em;
    color: #fff;
  }
  .fcc-nav-login a {
    color: #fff;
  }
  .fcc-header-menu-trigger{
    display: none;
  }
}
.fcc-view{
  box-sizing: border-box;
  margin: 1em 0;
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
    padding-right: 0;
    vertical-align: top;
    width: 360px;
  }
  .fcc-view{
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 360px);
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
.fcc-nav-list .active-bg-color{
  width: 0;
  display: block;
  transition: width .3s ease;
}
.fcc-nav-list .active-color .active-bg-color{
  width: .5em;
  height: 100%;
  float: right;
}
@media screen and (min-width: 1024px) {
  .fcc-nav-list .active-color .active-bg-color{
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: .3em;
  }
}
</style>

