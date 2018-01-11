<template>
  <transition name="el-fade-in">
    <div class="avatar-upload popup-box-outer">
      <div class="popup-box">
        <h2 class="popup-header">上传头像</h2>
        <i class="el-icon-close" title="关闭" @click="close"></i>
        <div class="popup-content">
          
        </div>
        <div class="popup-btns">
          <el-button type="primary" :loading="submiting" @click="submit">山传</el-button>
          <el-button type="primary" :loading="submiting" @click="close">取消</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'AvatarUpload',
  props: {
    show: Boolean
  },
  data () {
    return {
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
