<template>
  <div class="header-wp">
    <el-popover
      ref="popover"
      placement="bottom"
      width="100"
      trigger="hover">
      <ul>
        <li class="header-user-operate" @click="checkMyself"><i class="iconfont icon-ziliao"></i>个人资料</li>
        <li class="header-user-operate" @click="logout"><i class="iconfont icon-dengchu"></i>退出</li>
      </ul>
    </el-popover>

    <div class="header-avatar-wp">
      <span class="text-primary-color header-username">Hi,{{user.username}}</span>
      <div class="header-avatar-shade" v-popover:popover>
        <img :src="user.userPic" v-if="user.userPic" alt="avatar" class="header-avatar">
        <img v-else src="/static/imgs/avatar-boy.png" alt="avatar">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheHeader',
  data () {
    return {
      user: this.$store.state.user
    }
  },
  created() {
    if (!this.user._id) {
      this.getCurUser();
    }
  },
  methods: {
    async getCurUser() {
      const params = {
        _id: this.Cookies.get('_id')
      }
      try {
        const { sources } = await this.api.getUsers(params);
        if (sources && sources.length > 0) {
          this.$store.commit('updateUser', sources[0]);
        }
      } catch (error) {
        
      }
    },
    checkMyself() {
      const userId = this.$store.state.user._id;
      if (userId) {
        this.$router.push('/user/edit/' + userId);
      } else {
        this.$message({
          message: '用户信息获取失败，请刷新页面！',
          type: 'info'
        });
      }
    },
    logout() {
      this.$store.commit('updateUser', {
        _id: '',
        userPic: '',
        username: ''
      });
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.header-wp{
  width: 100%;
  height: 100%;
}
.header-avatar-wp{
  float: right;
  height: 100%;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-avatar-shade{
  height: 50px;
  width: 50px;
  border-radius: 50%;
  overflow: hidden;
}
.header-avatar{
  width: 100%;
  height: 100%;
}
.header-username{
  font-size: 14px;
  margin-right: 10px;
}
.header-user-operate{
  cursor: pointer;
  padding: 4px 8px;
}
.header-user-operate:hover{
  background-color: #ecf5ff;
}
.el-popover{
  padding: 6px 0;
}
</style>
