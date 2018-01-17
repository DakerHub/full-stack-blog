<template>
  <div class="fcc-page light-2-primary-color">
    <header class="fcc-header default-primary-color">
      <i class="iconfont icon-weibiaoti12 fcc-header-menu-trigger light-footer-color" @click="sidebarShow = true"></i>
      <transition name="slide-right">
        <section class="fcc-nav" v-show="sidebarShow">
          <div class="fcc-nav-avatar"></div>
          <p class="fcc-nav-login">
            <router-link to="">登录</router-link>
             / 
            <router-link to="">注册</router-link>
          </p>
          <nav class="fcc-nav-list">
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
            <ul class="fcc-nav-outlink">
              <li><a href=""><i class="iconfont icon-github"></i></a></li>
              <li><i class="iconfont icon-mail"></i></li>
            </ul>
          </nav>
        </section>
      </transition>
    </header>


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
.fcc-header-menu-trigger{
  font-size: 2em;
  margin: .5em;
  float: right;
  cursor: pointer;
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
.fcc-nav-login a {
  color: #fff;
  text-decoration: none;
}
.fcc-nav-list{
  height: calc(100% - 8em);
  padding-top: 2em;
  background-color: #673AB7;
}
.fcc-nav-list a{
  color: #fff;
  text-decoration: none;
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
    display: flex !important;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    background-color: transparent;
    background-image: none;
  }
  .fcc-nav-avatar{
    height: 3em;
    width: 3em;
    margin: 0;
    order: 2;
  }
  .fcc-nav-list{
    height: 100%;
    padding: 0;
    margin-right: 40px;
    text-align: center;
    background-color: transparent;
    flex-grow: 1;
    order: 1;
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
    margin: 0 20px;
    font-size: .6em;
    color: #fff;
    order: 3;
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
@media screen and (min-width: 1024px) {
  .active-color .active-bg-color{
    position: absolute;
    bottom: 0px;
    left: 0px;
    display: block;
    width: 100%;
    height: .3em;
  }
}
</style>

