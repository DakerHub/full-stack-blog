import Vue from 'vue';
import Vuex from 'vuex';
import { getPosts, getTags, getNewestPosts, getNewestComments, getPostDetail, getTagById } from './../assets/api/index';
import { date2text } from './../assets/util/util.js';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
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
      getPosts({ commit }, currentPage) {
        return getPosts(currentPage).then(res => {
          const posts = res.data.sources;
          const total = res.data.total;
          posts.forEach(element => {
            element.date = element.date.split(' ')[0];
          });
          commit('setPosts', posts);
          commit('setPostsTotal', total);
        });
      },
      getTags({ commit }) {
        return getTags().then(res => {
          const tags = res.data.sources;
          commit('setTags', tags);
        });
      },
      getNewestPosts({ commit }) {
        return getNewestPosts().then(res => {
          const newestPosts = res.data.sources;
          newestPosts.forEach(element => {
            element.date = date2text(element.date);
          });
          commit('setNewestPosts', newestPosts);
        });
      },
      getNewestComments({ commit }) {
        return getNewestComments().then(res => {
          const newestComments = res.data.sources;
          newestComments.forEach(element => {
            element.createdDate = date2text(element.createdDate);
          });
          commit('setNewestComments', newestComments);
        });
      },
      getPostDetail({ commit }, id) {
        return getPostDetail(id).then(res => {
          const post = res.data.source;
          commit('setPostDetail', post);
        });
      },
      getTagName({ commit }, id) {
        return getTagById(id).then(res => {
          const tag = res.data.source;
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
        state.user.id = id;
        state.user.username = username;
        state.user.userPic = userPic;
      },
      setQueryTagName(state, name) {
        state.queryTagName = name;
      }
    }
  });
}
