<template>
  <div class="fcc-main">
    <header class="fcc-header default-primary-color"></header>
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
.fade-enter-active, .fade-leave-active{
  transition: all .5s ease;
}

.fade-enter, .fade-leave-active{
  opacity: 0;
}
</style>

