import Vuex from 'vuex';
import Vue from 'vue';
import { MessageBox } from 'element-ui';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      _id: '',
      userPic: '',
      username: ''
    },
    activedTab: '',
    tabIndex: 0,
    tabs: []
  },
  mutations: {
    updateUser(state, user) {
      const { _id, userPic, username } = user;
      state.user._id = _id;
      state.user.userPic = userPic;
      state.user.username = username;
    },
    pushTab(state, tab) {
      state.tabs.push(tab);
    },
    increaseTab(state) {
      state.tabIndex++;
    },
    setActivedTab(state, val) {
      state.activedTab = val;
    },
    removeTab(state, targetName) {
      const { tabs } = state;
      state.tabs = tabs.filter(tab => tab.name !== targetName);
    },
    clearTab(state) {
      state.tabs = [];
    }
  }
});
