<template>
  <nav class="main-breadcrumb">
    <ul class="main-breadcrumb-nav">
      <li v-for="(item, index) in position">
        <router-link
          :class="{'is-disabled': item.disabled}"
          :to="item.disabled ? '' : item.route">{{item.title}}</router-link>
        <i class="main-breadcrumb-nav-spliter" v-if="index < position.length - 1">/</i>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'MainBreadcrumb',
  computed: {
    position() {
      return this.$store.state.position;
    }
  }
}
</script>

<style scoped>
.main-breadcrumb-nav{
  padding: .5em 1em;
  background-color: #fff;
}
.main-breadcrumb-nav li{
  display: inline-block;
  vertical-align: middle;
}
.main-breadcrumb-nav a{
  font-size: .8em;
  font-weight: bold;
  line-height: 1.3em;
  color: #303133;
  text-decoration: none;
  transition: color .3s ease;
}
.main-breadcrumb-nav a:hover{
  color: #00BCD4;
}
.main-breadcrumb-nav a.is-disabled{
  color: #606266;
}
.main-breadcrumb-nav-spliter{
  margin: 0 .5em;
  color: #606266;
}
</style>
