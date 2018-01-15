<template>
  <div class="fcc-main">
    <header class="fcc-header"></header>
    <transition name="fade">
      <router-view class="fcc-view" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TheMain'
}
</script>

<style>
.fcc-main{
  height: 100%;
}
.fcc-header{
  height: 4em;
  width: 100%;
  background-color: #673AB7;
}
.fcc-view{
  color: #212121;
  background-color: #f6f0ff;
}
.fade-enter-active, .fade-leave-active{
  transition: all .5s ease;
}

.fade-enter, .fade-leave-active{
  opacity: 0;
}
</style>

