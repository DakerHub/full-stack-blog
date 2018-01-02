<template>
  <div class="admin-login">
    <h1 class="system-title">FCC's博客内容管理系统</h1>
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
            { min: 6, max: 18, message: '密码长度要求在6-18之间' }
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
export default {
  name: 'TheLogin',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      submiting: false
    }
  },
  methods: {
    validateUser () {
      let result = true;
      this.$refs.userInfo.validate(valid => {
        console.log(valid);
        result = valid;
      });
      return result;
    },
    submit () {
      const valid = this.validateUser();
      this.submiting = true

      if (valid) {
        this.api.login(this.user).catch(err => {
          console.log(err);
        }).then(() => {
          this.submiting = false;
        });
      }
    }
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
</style>
