<template>
  <div class="fcc-page light-2-primary-color">
    <header class="fcc-header default-primary-color">
      <i class="iconfont icon-sousuo fcc-header-search light-text-color" title="搜索" @click="searchShow=true"></i>
      <i class="iconfont icon-weibiaoti12 fcc-header-menu-trigger light-text-color" @click="sidebarShow = true"></i>
      <transition name="slide-right">
        <section class="fcc-nav" v-show="sidebarShow">
          <div class="fcc-nav-user-info">
            <div class="fcc-nav-avatar">
              <img :src="user.userPic" alt="">
            </div>
            <p class="fcc-nav-login light-text-color" v-if="hasLogin">
              <span>{{user.username}}</span>
              ,
              <a class="fcc-nav-login-btn" @click.prevent="logout">退出</a>
            </p>
            <p class="fcc-nav-login light-text-color" v-else>
              <a class="fcc-nav-login-btn" @click.prevent="$store.commit('showLogin', 'login')">登录</a>
              / 
              <a class="fcc-nav-login-btn" @click.prevent="$store.commit('showLogin', 'signup')">注册</a>
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
                  <i :class="route.icon"></i>
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

    <TheFooter />
    
    <TheLogin
      :show.sync="loginShow" />

    <button 
      class="back-to-top"
      data-type="text"
      title="回到顶部"
      v-show="showBackToTop"
      @click="backToTop">
      <i class="iconfont icon-triangle-top"></i>
    </button>

    <transition name="fade">
      <div
        class="fcc-mask"
        v-show="sidebarShow"
        @click="sidebarShow = false" />
    </transition>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import RecentTabs from './MainAsideRecentTabs.vue';
import MainBreadcrumb from './MainBreadcrumb.vue';
import TheFooter from './TheFooter.vue';
import TheLogin from './TheLogin.vue';
import { getUserInfo } from './../assets/api';
import { throttle } from './../assets/util/util';

export default {
  name: 'TheMain',
  data() {
    return {
      sidebarShow: false,
      searchShow: false,
      showBackToTop: false
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
    TheFooter,
    TheLogin
  },
  computed: {
    routes() {
      return this.$store.state.navTabs;
    },
    activeRoute() {
      let activeRoute;
      const path = this.$route.path.split('/').filter(Boolean);
      if (path.length === 1 || (path[1] === 'post')) {
        activeRoute = '/blog';
      } else if (path[1] === 'user') {
        activeRoute = this.$route.path;
      } else {
        activeRoute = `/${path[0]}/${path[1]}`;
      }
      return activeRoute;
    },
    loginShow() {
      return this.$store.state.loginShow;
    },
    user() {
      return this.$store.state.user;
    },
    hasLogin() {
      return this.user.id;
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
  },
  mounted() {
    const id = Cookies.get('blogUserId');
    const scrollTop = function (context) {
      this.showBackToTop = document.documentElement.scrollTop - window.innerHeight > 0;
    };

    if (id) {
      getUserInfo(id).then(data => {
        const { _id, username, userPic } = data.source;
        this.$store.commit('updateUser', {
          id: _id,
          username,
          userPic
        });
        this.$store.commit('addNav', {
          name: '我的',
          route: `/blog/user/${_id}`,
          icon: 'iconfont icon-touxiang'
        });
      }).catch(err => {
        console.error(err);
        this.$message({
          message: '获取用户信息失败！',
          type: 'error'
        });
      });
    }
    document.addEventListener('scroll', throttle(scrollTop.bind(this), 100));
  },
  methods: {
    logout() {
      const sure = confirm('确定要退出？');
      if (!sure) {
        return;
      }
      Cookies.remove('blogUserId');
      Cookies.remove('blogToken');
      this.$store.commit('removeNavByRoute', `/blog/user/${this.user.id}`);
      this.$store.commit('clearUser');
      if (this.$route.path.includes('/blog/user')) {
        this.$router.push('/blog');
      }
    },
    backToTop() {
      document.documentElement.scrollTop = 0;
    }
  }
}
</script>

<style scoped>
.fcc-page{
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.fcc-main{
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  flex-grow: 1;
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
  border-radius: 0;
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
  .fcc-main{
    padding: 0 1em;
    box-sizing: border-box;
  }
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
  overflow: hidden;
  background-color: #fff;
  background-image: url('/static/avatar/default_avatar.png');
  background-size: contain;
}
.fcc-nav-avatar img{
  width: 100%;
  height: 100%;
}
.fcc-nav-login{
  text-align: center;
  margin-bottom: 1em;
}
.fcc-nav-login-btn{
  cursor: pointer;
  text-decoration: none;
  transition: color .3s ease;
}
.fcc-nav-login-btn:hover{
  color: #fff !important;
}
@media screen and (max-width: 1024px) {
  .fcc-nav-login{
    color: #fff !important;
  }
  .fcc-nav-login-btn{
    text-decoration: underline;
  }
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
  .fcc-header-menu-trigger{
    display: none;
  }
}
.fcc-view{
  box-sizing: border-box;
  margin: 1rem 0;
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
.back-to-top{
  position: fixed;
  right: 1em;
  bottom: 2em;
  height: 3em;
  width: 3em;
  border-radius: 50%;
  color: #757575;
  background-color: #fff !important;
  box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.2);
}
.back-to-top .iconfont{
  margin: 0;
}
</style>

