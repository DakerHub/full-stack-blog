<template>
  <div class="user-edit box-content">
    <el-form :model="editUser" label-width="100px">
      <el-form-item label="用户名">
        {{editUser.username}}
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="editUser.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
          <el-radio label="3">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="editUser.age" placeholder="请输入您的年龄"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="editUser.phone" placeholder="请输入您的电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editUser.mail" placeholder="请输入您的邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="submiting" type="primary" @click="submit">保存</el-button>
      </el-form-item>
      <span class="cross-line"></span>
      <el-form-item label="旧密码">
        <el-input v-model="oldPw" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="newPw" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input v-model="confirmPw" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="submiting" type="primary" :disabled="editPwDisabled" @click="updatePw">修改密码</el-button>
      </el-form-item>
    </el-form>

    <div class="user-info-right">
      <div class="user-info-avatar" :style="avatarBg">
        <img id="userPic" v-show="editUser.userPic" :src="editUser.userPic || ''" alt="">
      </div>
      <el-upload
        ref="upload"
        action=""
        :file-list="fileList"
        :http-request="updateAvatar"
        :show-file-list="false"
        :auto-upload="true">
        <el-button slot="trigger">上传头像</el-button>
      </el-upload>
    </div>

  </div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';
import util from './../assets/js/util.js';
import config from './../assets/js/config.js';

export default {
  name: 'PostEdit',
  mixins: [elTab],
  data() {
    return {
      editUser: {
        username: '',
        sex: '1',
        age: '',
        phone: '',
        mail: '',
        _id: ''
      },
      
      fileList: [],

      oldPw: '',
      newPw: '',
      confirmPw: '',
      submiting: false,
    };
  },
  computed: {
    userId() {
      return this.$route.params.id;
    },
    avatarBg() {
      const sexName = this.editUser.sex === '2' ? 'girl' : 'boy';
      return { backgroundImage: 'url(' + config.staticDir + 'imgs/avatar-' + sexName + '.png)' };
    },
    editPwDisabled() {
      return !(this.oldPw && this.newPw && this.confirmPw)
    }
  },
  watch: {
    '$route.path'() {
      this.getUser();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getUser();
    })
  },
  created() {
    this.addTab('编辑用户', this.$route.path, 'iconfont icon-ziliao');
  },
  methods: {
    async submit() {
      const { sex, age, phone, mail, _id } = this.editUser;
      const params = { sex, age, phone, mail, _id };
      try {
        this.submiting = true;
        await this.api.editUser(params);
        this.modified = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.submiting = false;
      }
    },
    async getUser() {
      const params = {
        _id: this.userId
      }
      try {
        const { sources } = await this.api.getUsers(params);
        if (sources && sources.length > 0) {
          this.updateUser(sources[0]);
          this.changeTabTitle(sources[0].username);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updatePw() {
      const params = {
        _id: this.editUser._id,
        newPw: this.newPw,
        oldPw: this.oldPw
      }
      this.submiting = true;
      try {
        const res = await this.api.updateUserPassword(params);
        if (res) {
          this.oldPw = '';
          this.newPw = '';
          this.confirmPw = '';
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.submiting = false;
      }
    },
    async updateAvatar(arg) {
      const params = {
        _id: this.editUser._id,
        avatar: arg.file
      }
      try {
        const res = await this.api.updateUserAvatar(params);
        if (res) {
          this.updateUser(res.source);
          if (this.$store.state.user._id === res.source._id) {
            this.$store.commit('updateUser', res.source);
          }
        }
      } catch (error) {
      } finally {
      }
      console.log(arguments);
    },
    updateUser(user) {
      const { userPic, username, sex, age, phone, mail, _id } = user;
      this.editUser = {
        userPic,
        username,
        sex,
        age,
        phone,
        mail,
        _id
      }
    },
    changeTabTitle(title) {
      this.$store.commit('setTagNameByRoute', {
        route: this.$route.path,
        label: title || '编辑用户'
      });
    }
  }
}
</script>

<style scoped>
.user-edit{
  background-color: #fff;
  padding: 20px;
}
.el-form{
  width: 400px;
  display: inline-block;
  vertical-align: top;
}
.user-info-right{
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
}
.user-info-avatar{
  height: 80px;
  width: 80px;
  margin: 10px 0;
  box-shadow: 0 0 3px 1px rgba(88, 88, 88, 0.27);
  background-repeat: no-repeat;
  background-size: contain;
}
.user-info-avatar img{
  height: 100%;
  width: 100%;
}
.cross-line{
  display: block;
  height: 1px;
  width: 100%;
  background-color: #dcdcdc;
  margin: 10px 0;
}
</style>
