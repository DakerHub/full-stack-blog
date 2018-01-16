import Vue from 'vue';
import Vuex from 'vuex';
import { getPosts } from './../assets/api/index';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      posts: [],
      postsTotal: 0
    },
    actions: {
      getPosts({ commit }, currentPage) {
        return getPosts(currentPage).then(res => {
          const posts = res.data.sources;
          const total = res.data.total;
          commit('setPosts', posts);
          commit('setPostsTotal', total);
        });
      }
    },
    mutations: {
      setPosts(state, posts) {
        state.posts = posts;
      },
      setPostsTotal(state, total) {
        state.postsTotal = total;
      }
    }
  });
}
