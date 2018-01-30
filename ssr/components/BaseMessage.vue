<template>
  <transition name="slide-down">
    <div 
      :class="['base-message', `base-message--${type}`]"
      v-show="show"
      @mouseenter="clearTimer"
      @mouseleave="timeoutClose">
      <p class="base-message__content">
        <i :class="['base-message__icon', 'iconfont', iconClass]"></i>{{message}}</p>
      <i
        class="base-message__close iconfont icon-close"
        v-if="showClose"
        @click="close"></i>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseMessage',
  data() {
    return {
      show: false,
      message: '',
      timer: 0,
      duration: 3000,
      type: 'success',
      onClose: null,
      showClose: false
    };
  },
  computed: {
    iconClass() {
      return {
        'success': 'icon-Success',
        'error': 'icon-error',
        'warn': 'icon-warn',
        'info': 'icon-about'
      }[this.type] || 'icon-about';
    }
  },
  mounted() {
    this.timeoutClose();
  },
  methods: {
    close() {
      this.show = false;
      this.clearTimer();
      this.onClose(this);
      // TODO 退出动画,需要使用js控制
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
    timeoutClose() {
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration);
    },
    clearTimer() {
      clearTimeout(this.timer);
    }
  }
}
</script>
