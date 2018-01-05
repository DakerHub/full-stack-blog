<template>
  <div>home</div>
</template>

<script>
export default {
  name: 'Home',
  created() {
    this.$store.commit('clearTab');
  }
}
</script>

<style scoped>

</style>
