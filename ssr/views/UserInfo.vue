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
          <img :src="user.userPic" alt="">
        </div>
        <button class="user-info-upload">上传图片</button>
      </div>
    </div>
    <span class="user-info-spliter"></span>
    <div class="user-info-col">
      <span class="user-info-col-label">修改密码：</span>
      <div class="user-info-col-content">
        <input class="user-info-input" type="password" placeholder="原密码">
        <input class="user-info-input" type="password" placeholder="新密码">
        <input class="user-info-input" type="password" placeholder="再次输入新密码">
        <button>修改密码</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UserInfo',
  computed: {
    user() {
      return this.$store.state.user;
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
  }
}
</script>

<style scoped>
.user-info{
  background-color: #fff;
  padding: 1em;
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
  width: 6rem;
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
