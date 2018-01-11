<template>
  <transition name="el-fade-in">
    <div class="user-new popup-box-outer">
      <div class="popup-box">
        <h2 class="popup-header">新建用户</h2>
        <i class="el-icon-close" title="关闭" @click="close"></i>
        <div class="popup-content">
          <el-form :model="newUser" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="newUser.username" required placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="newUser.password" required type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="newUser.confirmPw" required type="password" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="用户类型">
              <el-radio-group v-model="newUser.userType">
                <el-radio label="2">普通用户</el-radio>
                <el-radio label="1">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="newUser.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
                <el-radio label="3">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="newUser.age" placeholder="请输入您的年龄"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="newUser.phone" placeholder="请输入您的电话"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="newUser.mail" placeholder="请输入您的邮箱"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="popup-btns">
          <el-button type="primary" :loading="submiting" @click="submit">保存</el-button>
          <el-button type="primary" :loading="submiting" @click="close">取消</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'UserNew',
  props: {
    show: Boolean
  },
  data () {
    return {
      newUser: {
        username: '',
        password: '',
        confirmPw: '',
        userType: '2',
        sex: '1',
        age: '',
        phone: '',
        mail: ''
      },
      submiting: false
    };
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    close() {
      this.$emit('update:show', false);
    },
    async submit() {
      const params = Object.assign({}, this.newUser);
      delete params.confirmPw;
      this.submiting = true;
      try {
        await this.api.newUser(params);
        this.$emit('update-list');
        this.close();
      } catch (error) {
        console.error(error);
      } finally {
        this.submiting = false;
      }
    }
  }
};
</script>
<style scoped>
@keyframes my-zoom
{
  from {
    transform: scaleY(.1);
    opacity: .4;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}
.popup-box{
  width: 500px;
  height: 520px;
  top: calc(50% - 260px);
  left: calc(50% - 250px);
  animation: my-zoom .3s;
}
.popup-content{
  padding-right: 40px;
}
.el-icon-close{
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 24px;
  transition: transform .5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.el-icon-close:hover{
  color: #333;
  transform: rotate(180deg);
}
.popup-btns{
  text-align: center;
}
</style>
