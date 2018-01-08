<template>
  <div class="admin-login">
    <h1 class="system-title">FCC's博客内容管理系统</h1>
    <div :class="{'login-info': true, 'is-error': isError}">{{loginInfo}}</div>
    <div class="admin-login-form">
      <el-form :model="user" ref="userInfo">
        <el-form-item
          prop="username"
          :rules="[
            { required: true, message: '用户名不能为空'},
            { type: 'string', pattern: /^\w+$/, max: 18, message: '请输入正确的用户名'}
          ]">
          <el-input v-model="user.username" placeholder="username" @keyup.native.enter="submit"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[
            { required: true, message: '密码不能为空' },
            { max: 18, message: '密码长度应小于18' }
          ]">
          <el-input v-model="user.password" type="password" placeholder="password" @keyup.native.enter="submit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="submiting" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  name: 'TheLogin',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      loginInfo: '',
      isError: false,
      submiting: false,
      timer: 0
    }
  },
  methods: {
    validateUser () {
      let result = true;
      this.$refs.userInfo.validate(valid => {
        result = valid;
      });
      return result;
    },
    async submit () {
      const valid = this.validateUser();
      this.submiting = true;

      if (valid) {
        try {
          const res = await this.api.login(this.user);
          this.isError = false;
          this.loginInfo = '登录成功!';
          this.afterLogin(res);
        } catch (err) {
          this.isError = true;
          if (err.code === 404 || err.code === 400) {
            this.loginInfo = err.msg;
          } else {
            this.loginInfo = '登录失败!';
          }
          this.timer = setTimeout(() => {
            this.loginInfo = '';
          }, 2000);
        }
        this.submiting = false;
      }
    },
    afterLogin ({source}) {
      Cookies.set('blog-admin-token', source.token);
      Cookies.set('_id', source._id);
      this.$store.commit('updateUser', source);
      this.$router.push('/');
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer);
  }
}
</script>

<style scoped>
.admin-login{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.admin-login-form{
  width: 300px;
  height: 200px;
  margin: 0 auto;
}
.login-btn{
  width: 100%;
}
.system-title{
  font-size: 1.5em;
  color: #303133;
  padding: 20px 0;
  margin-top: -64px;
}
.login-info{
  font-size: 12px;
  color: #67C23A;
  height: 30px;
  line-height: 30px;
}
.login-info.is-error{
  color: #F56C6C;
}
</style>
