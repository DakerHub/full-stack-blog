<template>
  <transition name="fade">
    <section class="the-login" v-show="show">
      <div class="the-login-main">
        <h2 class="the-login-title">{{actionName}}</h2>
        <i class="iconfont icon-close" @click="close"></i>
        <form class="the-login-form">
          <input
            class="the-login-form-item"
            v-model="username"
            type="text"
            placeholder="请输入用户名">
          <input
            class="the-login-form-item"
            v-model="password"
            type="password"
            autocomplete
            placeholder="请输入密码">
          <button
            :class="{
              'the-login-form-item': true,
              'is-disabled': !editable
            }"
            :disabled="!editable"
            @click.prevent="submit"><i class="iconfont icon-loading-out" v-show="submiting"></i>{{actionName}}</button>
        </form>
        <div class="the-login-help">
          <span v-if="action==='login'" @click="changeAction('signup')">没有账号？注册一个</span>
          <span v-if="action==='signup'" @click="changeAction('login')">已有账号？登录</span>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
import Cookies from 'js-cookie';
import { login, userRegister } from './../assets/api/index';

export default {
  name: 'TheLogin',
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      username: '',
      password: '',
      submiting: false
    };
  },
  computed: {
    action() {
      return this.$store.state.loginAction;
    },
    actionName() {
      return this.action === 'login' ? '登录' : '注册';
    },
    editable() {
      return this.username && this.password;
    }
  },
  methods: {
    close() {
      this.$store.commit('hideLogin');
    },
    submit() {
      if (this.submiting) {
        return;
      }
      this.action === 'login' ? this.loginSubmit() : this.signup();
    },
    loginSubmit() {
      this.submiting = true;
      login({
        username: this.username,
        password: this.password
      }).then(({ data }) => {
        console.log(data);
        if (data.code !== 200) {
          throw new Error(data.msg);
          return;
        }
        this.username = '';
        this.password = '';
        const { _id, username, userPic, token } = data.source;
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
        Cookies.set('blogToken', token);
        Cookies.set('blogUserId', _id);
        this.submiting = false;
        this.close();
      }).catch(err => {
        console.error(err);
        this.submiting = false;
      });
    },
    signup() {
      this.submiting = true;
      userRegister({
        username: this.username,
        password: this.password
      }).then(res => {
        this.$store.commit('changeLoginAction', 'login');
        this.password = '';
        this.submiting = false;
      }).catch(err => {
        this.submiting = false;
      });
    },
    changeAction(action) {
      this.$store.commit('changeLoginAction', action);
      this.username = '';
      this.password = '';
    }
  }
}
</script>

<style>
.the-login{
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .2);
  z-index: 2000;
}
.the-login-main{
  position: relative;
  width: 80%;
  height: 60%;
  min-height: 400px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 12px rgba(4, 4, 4, 0.18);
}
.the-login-title{
  width: 100%;
  font-size: 1.2em;
  font-weight: bold;
  padding: 1em;
}
.the-login-main>.icon-close{
  position: absolute;
  right: 1em;
  top: 1em;
  font-size: 1.2em;
  color: #8c8c8c;
  cursor: pointer;
  transition: color .3s;
}
.icon-close:hover{
  color: #212121;
}
.the-login-form{
  padding: 1em 2em;
}
.the-login-form-item{
  margin-bottom: 1em;
  width: 100%;
}
.the-login-form button{
  color: #fff;
  background-color: #00BCD4;
  border-color: #00BCD4;
}
.the-login-help{
  padding: 0 2.5em;
  font-size: .8em;
  color: #00bcd4;
}
.the-login-help span{
  cursor: pointer;
}
@media screen and (min-width: 425px) {
  .the-login-main{
    width: 340px;
    height: 400px;
  }
}
button.the-login-form-item{
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

