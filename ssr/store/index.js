import Vue from 'vue';
import Vuex from 'vuex';
import { getPosts, getTags, getNewestPosts, getNewestComments, getPostDetail } from './../assets/api/index';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      posts: [],
      postsTotal: 0,
      tags: [],
      newestPosts: [],
      newestComments: [],
      postDetail: {
        title: '',
        content: '',
        date: ''
      },
      position: []
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
            element.date = element.date.split(' ')[0];
          });
          commit('setNewestPosts', newestPosts);
        });
      },
      getNewestComments({ commit }) {
        return getNewestComments().then(res => {
          const newestComments = res.data.sources;
          newestComments.forEach(element => {
            element.createdDate = element.createdDate.split(' ')[0];
          });
          commit('setNewestComments', newestComments);
        });
      },
      getPostDetail({ commit }, id) {
        return getPostDetail(id).then(res => {
          const post = res.data.source;
          commit('setPostDetail', post);
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
      }
    }
  });
}
