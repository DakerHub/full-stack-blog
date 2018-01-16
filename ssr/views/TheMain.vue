<template>
  <div class="fcc-main">
    <header class="fcc-header default-primary-color">
      <div class="fcc-header-avatar"></div>
    </header>
    <transition name="fade">
      <router-view class="fcc-view primary-text-color light-2-primary-color" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TheMain'
}
</script>

<style scoped>
.fcc-main{
  height: 100%;
}
.fcc-header{
  height: 4em;
  width: 100%;
}
.fcc-header-avatar{
  height: 3em;
  width: 3em;
  margin: .5em 1em;
  border-radius: 50%;
  background-color: #fff;
  float: right;
}
.fade-enter-active, .fade-leave-active{
  transition: all .5s ease;
}

.fade-enter, .fade-leave-active{
  opacity: 0;
}
</style>

