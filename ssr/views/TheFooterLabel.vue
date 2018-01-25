<template>
  <section class="the-label-footer dark-primary-color text-primary-color">
    <div class="the-label-footer-inner">
      <h2 class="the-label-footer-title">LABEL</h2>
      <span class="the-label-footer-split light-footer-bg-color"></span>
      <ul class="the-label-footer-list">
        <li v-for="tag in tags" :key="tag._id">
          <router-link class="light-text-color" :to="`/blog?tag=${tag._id}`">{{tag.name}}&nbsp;{{`（${tag.postCount}）`}}</router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TheLabelFooter',
  computed: {
    tags() {
      return this.$store.state.tags
    }
  }
}
</script>

<style scoped>
.the-label-footer-inner{
  padding: 4em 1em;
  max-width: 600px;
  margin: 0 auto;
}
.the-label-footer-title{
  font-weight: bold;
}
.the-label-footer-split{
  display: block;
  height: 2px;
  width: 100%;
  margin: 5px 0;
}
.the-label-footer-list li{
  display: inline-block;
  width: 50%;
  padding: 1em 0;
  font-size: .8em;
}
.the-label-footer-list a{
  text-decoration: none;
}
.the-label-footer-list a:hover{
  text-decoration: underline;
}
</style>
