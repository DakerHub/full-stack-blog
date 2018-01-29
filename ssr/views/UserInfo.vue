<template>
  <section class="user-info">
    <div class="user-info-col">
      <span class="user-info-col-label">用户名：</span>
      <span>{{user.username}}</span>
    </div>
    <div class="user-info-col">
      <span class="user-info-col-label">头像：</span>
      <div class="user-info-col-content">
        <div class="user-info-avatar-wp">
          <img v-if="user.userPic" :src="user.userPic" alt="">
          <span v-else>无</span>
        </div>
        <form>
          <button
            :class="{
              'user-info-upload': true,
              'is-disabled': avatarSubmiting
            }"
            @click.prevent="handleClick">
            <i class="iconfont icon-loading-out" v-show="avatarSubmiting"></i>
            {{avatarSubmiting?'上传中...':'上传图片'}}
          </button>
          <input id="avatar-upload" type="file" v-show="false" @change="changeFile">
        </form>
      </div>
    </div>
    <span class="user-info-spliter"></span>
    <div class="user-info-col">
      <span class="user-info-col-label">修改密码：</span>
      <form class="user-info-col-content">
        <input class="user-info-input" v-model="oldPw" type="password" autocomplete placeholder="原密码">
        <input class="user-info-input" v-model="newPw" type="password" autocomplete placeholder="新密码">
        <input class="user-info-input" v-model="confirmNewPw" type="password" autocomplete placeholder="再次输入新密码">
        <button
          :class="{
            'is-disabled': pwSubmiting || pwDisabled
          }"
          :disabled="pwDisabled"
          type="submit"
          @click.prevent="updatePassword">
          <i class="iconfont icon-loading-out" v-show="pwSubmiting"></i>
          修改密码
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import { uploadAvatar, updatePassword } from './../assets/api';

export default {
  name: 'UserInfo',
  data() {
    return {
      oldPw: '',
      newPw: '',
      confirmNewPw: '',
      avatarSubmiting: false,
      pwSubmiting: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    pwDisabled() {
      return !(this.oldPw && this.newPw && this.confirmNewPw);
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.commit('setPosition', [{
        title: 'BLOG',
        route: '/blog'
      }, {
        title: '个人信息',
        route: '',
        disabled: true
      }]);
    })
  },
  methods: {
    handleClick() {
      document.getElementById('avatar-upload').click();
    },
    changeFile(e) {
      const files = e.target.files;
      if (files.length) {
        this.submiting = true;
        uploadAvatar(this.user.id, files[0]).then(res => {
          const user = res.data.source;
          this.$store.commit('updateUser', { userPic: user.userPic });
          this.submiting = false;
        }).catch(() => {
          this.submiting = false;
        });
      }
      console.log(files);
    },
    updatePassword() {
      const params = {
        id: this.user.id,
        oldPw: this.oldPw,
        newPw: this.newPw
      };
      this.pwSubmiting = true;
      updatePassword(params).then(res => {
        this.pwSubmiting = false;
        this.oldPw = '';
        this.newPw = '';
        this.confirmNewPw = '';
      }).catch(err => {
        this.pwSubmiting = false;
      });
    }
  }
}
</script>

<style scoped>
.user-info{
  background-color: #fff;
  padding: 1em;
  font-size: .8em;
}
.user-info-col{
  padding: 1em 0;
}
.user-info-avatar-wp{
  height: 6rem;
  width: 6rem;
}
.user-info-col-label{
  display: inline-block;
  vertical-align: top;
  width: 100px;
  padding-right: 1em;
  text-align: right;
  box-sizing: border-box;
}
.user-info-col-content{
  display: inline-block;
  vertical-align: top;
}
.user-info-avatar-wp img{
  height: 100%;
  width: 100%;
}
.user-info-upload{
  margin-top: .5em;
  display: flex;
  align-items: center;
}
.user-info-input{
  display: block;
  margin: .5em 0;
}
.user-info-spliter{
  display: block;
  width: calc(100% - 100px);
  height: 1px;
  margin-left: 100px;
  background-color: #ccc;
}
</style>
