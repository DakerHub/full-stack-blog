<template>
  <section class="user-info">
    <div class="user-info-col">
      <span class="user-info-col-label">用户名：</span>
      <span class="user-info-col-content">{{user.username}}</span>
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
        <BaseInput
          class="user-info-input"
          v-model="oldPw"
          :validators="[
            {
              reg: /^([A-Z]|[a-z]|[0-9]){6,18}$/,
              errText: '请输入正确的密码'
            }
          ]"
          type="password"
          placeholder="原密码"
          @validation="val => oldPwValid = !val">
          <div class="base-input__info">
            <p><i class="iconfont icon-warn"></i>输入原来的密码。</p>
          </div>
        </BaseInput>
        <BaseInput
          class="user-info-input"
          v-model="newPw"
          :validators="[
            {
              reg: /^([A-Z]|[a-z]|[0-9]){6,18}$/,
              errText: '请输入正确的密码'
            }
          ]"
          type="password"
          placeholder="新密码"
          @validation="val => newPwValid = !val">
          <div class="base-input__info">
            <p><i class="iconfont icon-warn"></i>输入新的密码。</p>
            <p><i class="iconfont icon-warn"></i>包含英文、数字。</p>
            <p><i class="iconfont icon-warn"></i>长度在6-18。</p>
          </div>
        </BaseInput>
        <BaseInput
          class="user-info-input"
          v-model="confirmNewPw"
          :validators="[
            {
              equalTo: newPw,
              errText: '两次输入不一样！'
            }
          ]"
          type="password"
          placeholder="确认新密码"
          @validation="val => confirmNewPwValid = !val">
          <div class="base-input__info">
            <p><i class="iconfont icon-warn"></i>再次输入新的密码。</p>
          </div>
        </BaseInput>
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
import BaseInput from './../components/BaseInput.vue';
import { uploadAvatar, updatePassword } from './../assets/api';

export default {
  name: 'UserInfo',
  data() {
    return {
      oldPw: '',
      newPw: '',
      confirmNewPw: '',
      avatarSubmiting: false,
      pwSubmiting: false,
      oldPwValid: false,
      newPwValid: false,
      confirmNewPwValid: false
    };
  },
  components: {
    BaseInput
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    pwDisabled() {
      return !(this.oldPw && this.newPw && this.confirmNewPw && 
      this.oldPwValid && this.newPwValid && this.confirmNewPwValid);
    }
  },
  watch: {
    newPw() {
      this.confirmNewPw = '';
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
        uploadAvatar(this.user.id, files[0]).then(data => {
          const user = data.source;
          this.$store.commit('updateUser', { userPic: user.userPic });
          this.submiting = false;
        }).catch((err) => {
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
      updatePassword(params).then(data => {
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
  background-color: #eaeaea;
  text-align: center;
  line-height: 6rem;
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
@media screen and (max-width: 425px) {
  .user-info-col-label{
    display: block;
    text-align: left;
    margin-bottom: 1em;
  }
  .user-info-spliter{
    width: 100%;
    margin: 0;
  }
  .user-info-col-content{
    margin-left: 1em;
  }
}
</style>
