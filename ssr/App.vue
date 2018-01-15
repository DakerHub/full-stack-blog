<template>
  <div id="app">
    <header>

      <nav>
        <ul>
          <li><router-link to="">首页</router-link></li>
          <li><router-link to="">首页</router-link></li>
        </ul>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html,body,#app{
  height: 100%;
  width: 100%;
}
</style>
