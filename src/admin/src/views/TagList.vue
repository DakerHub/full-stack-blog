<template>
  <div>taglist</div>
</template>

<script>
import elTab from './../assets/mixins/elTab.js';

export default {
  name: 'TagList',
  mixins: [elTab],
  created () {
    this.addTab('标签列表', '/tag');
  }
}
</script>

<style scoped>

</style>
