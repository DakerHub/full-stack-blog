import Vue from 'vue';
import Vuex from 'vuex';
import { getPosts, getTags, getNewestPosts, getPopularPosts, getNewestComments, getPostDetail, getTagById } from './../assets/api/index';
import { date2text } from './../assets/util/util.js';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      navTabs: [
        {
          name: 'BLOG',
          route: '/blog',
          icon: 'iconfont icon-iconfont-momarticle'
        }
        // ,
        // {
        //   name: '画廊',
        //   route: '/blog/gallery',
        //   icon: 'iconfont icon-pictureo'
        // },
        // {
        //   name: '关于',
        //   route: '/blog/about',
        //   icon: 'iconfont icon-about'
        // }
      ],
      user: {
        id: '',
        username: '',
        userPic: ''
      },
      posts: [],
      postsTotal: 0,
      queryTagName: '',
      tags: [],
      newestPosts: [],
      popularPosts: [],
      newestComments: [],
      postDetail: {
        title: '',
        content: '',
        date: ''
      },
      position: [],
      loginShow: false,
      loginAction: 'login'
    },
    actions: {
      getPosts({ commit, state }, currentPage) {
        return getPosts(currentPage).then(data => {
          const posts = data.sources;
          const total = data.total;
          posts.forEach(element => {
            element.date = element.date.split(' ')[0];
          });
          commit('setPosts', posts);
          commit('setPostsTotal', total);
        });
      },
      getTags({ commit, state }) {
        if (state.tags.length) {
          return Promise.resolve();
        }
        return getTags().then(data => {
          const tags = data.sources;
          commit('setTags', tags);
        });
      },
      getNewestPosts({ commit, state }) {
        if (state.newestPosts.length) {
          return Promise.resolve();
        }
        return getNewestPosts().then(data => {
          const newestPosts = data.sources;
          newestPosts.forEach(element => {
            element.date = date2text(element.date);
          });
          commit('setNewestPosts', newestPosts);
        });
      },
      getPopularPosts({ commit, state }) {
        if (state.popularPosts.length) {
          return Promise.resolve();
        }
        return getPopularPosts().then(data => {
          const popularPosts = data.sources;
          popularPosts.forEach(element => {
            element.date = date2text(element.date);
          });
          commit('setPopularPosts', popularPosts);
        });
      },
      getNewestComments({ commit, state }) {
        if (state.newestComments.length) {
          return Promise.resolve();
        }
        return getNewestComments().then(data => {
          const newestComments = data.sources;
          newestComments.forEach(element => {
            element.createdDate = date2text(element.createdDate);
          });
          commit('setNewestComments', newestComments);
        });
      },
      getPostDetail({ commit }, id) {
        return getPostDetail(id).then(data => {
          const post = data.source;
          commit('setPostDetail', post);
        });
      },
      getTagName({ commit }, id) {
        return getTagById(id).then(data => {
          const tag = data.source;
          commit('setQueryTagName', tag.name);
        });
      }
    },
    mutations: {
      setPosts(state, posts) {
        state.posts = posts;
      },
      setPostsTotal(state, total) {
        state.postsTotal = total;
      },
      setTags(state, tags) {
        state.tags = tags;
      },
      setNewestPosts(state, newestPosts) {
        state.newestPosts = newestPosts;
      },
      setPopularPosts(state, popularPosts) {
        state.popularPosts = popularPosts;
      },
      setNewestComments(state, newestComments) {
        state.newestComments = newestComments;
      },
      setPostDetail(state, post) {
        state.postDetail = post;
      },
      setPosition(state, position) {
        state.position = position;
      },
      showLogin(state, initAction) {
        state.loginShow = true;
        state.loginAction = initAction;
      },
      hideLogin(state) {
        state.loginShow = false;
      },
      changeLoginAction(state, action) {
        state.loginAction = action;
      },
      updateUser(state, { id, username, userPic }) {
        id && (state.user.id = id);
        username && (state.user.username = username);
        userPic && (state.user.userPic = userPic);
      },
      clearUser(state) {
        state.user = {
          id: '',
          username: '',
          userPic: ''
        };
      },
      setQueryTagName(state, name) {
        state.queryTagName = name;
      },
      addNav(state, nav) {
        let exist = false;
        state.navTabs.forEach(tab => {
          if (tab.route === nav.route) {
            exist = true;
          }
        });
        !exist && state.navTabs.push(nav);
      },
      removeNavByRoute(state, route) {
        let idx;
        state.navTabs.some((tab, i) => {
          if (tab.route === route) {
            idx = i;
            return true;
          }
          return false;
        });
        state.navTabs.splice(idx, 1);
      }
    }
  });
}
