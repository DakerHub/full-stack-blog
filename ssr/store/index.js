import Vue from 'vue';
import Vuex from 'vuex';
import { getRecentPost } from './../assets/api/index';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      posts: []
    },
    actions: {
      getRecentPost({ commit }) {
        return getRecentPost().then(res => {
          console.log(res.data);
          const posts = res.data.sources;
          commit('setPosts', posts);
        });
      }
    },
    mutations: {
      setPosts(state, posts) {
        state.posts = posts;
      }
    }
  });
}
