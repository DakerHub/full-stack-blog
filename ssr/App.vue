<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body,#app{
  height: 100%;
  width: 100%;
}
body{
  overflow: auto;
}
</style>
