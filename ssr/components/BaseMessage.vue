<template>
  <div class="base-message">
    <i class="base-message__icon"></i>
    <p class="base-message__content">{{message}}</p>
    <i class="base-message__close iconfont icon-close" @click="close"></i>
  </div>
</template>

<script>
export default {
  name: 'BaseMessage',
  data() {
    return {
      message: 'test'
    };
  },
  methods: {
    close() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>
