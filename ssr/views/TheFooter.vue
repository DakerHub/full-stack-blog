<template>
  <div>
    <TheFooterLabel></TheFooterLabel>
    <footer class="the-footer deep-dark-primary-color">Created By <span class="author">PaDaker</span></footer>
  </div>
</template>

<script>
import TheFooterLabel from './TheFooterLabel.vue';

export default {
  name: 'TheFooter',
  components: {
    TheFooterLabel
  }
}
</script>

<style scoped>
.the-footer{
  padding: 1em;
  text-align: center;
  font-size: .8em;
  color: #9465ff;
}
.author{
  color: #fff;
}
</style>
