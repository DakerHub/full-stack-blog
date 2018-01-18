import Vue from 'vue';
import Vuex from 'vuex';
import { getPosts, getTags, getNewestPosts, getNewestComments } from './../assets/api/index';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      posts: [],
      postsTotal: 0,
      tags: [],
      newestPosts: [],
      newestComments: []
    },
    actions: {
      getPosts({ commit }, currentPage) {
        return getPosts(currentPage).then(res => {
          const posts = res.data.sources;
          const total = res.data.total;
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
          commit('setNewestPosts', newestPosts);
        });
      },
      getNewestComments({ commit }) {
        return getNewestComments().then(res => {
          const newestComments = res.data.sources;
          commit('setNewestComments', newestComments);
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
      }
    }
  });
}
