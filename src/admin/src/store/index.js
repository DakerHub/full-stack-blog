import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      _id: '',
      userPic: '',
      username: ''
    }
  },
  mutations: {
    updateUser(state, user) {
      const { _id, userPic, username } = user;
      state.user._id = _id;
      state.user.userPic = userPic;
      state.user.username = username;
    }
  }
});
