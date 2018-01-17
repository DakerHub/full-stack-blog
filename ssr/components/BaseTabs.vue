<template>
  <div class="i-tabs">
    <div class="tabs-wp">
      <ul>
        <li
          class="i-tab"
          v-for="tab in tabs"
          :class="curTab == tab.id ? 'is-active': ''"
          :style="{
            color: curTab == tab.id ? activeColor : ''
          }"
          :key="tab.label"
          @click="handleClick($event,tab)">{{tab.label}}</li>
      </ul>
      <div
        class="i-tabs__active-bar"
        :style="{
          backgroundColor: activeColor
        }"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'iTabs',
  props: {
    tabs: Array,
    activeTab: String,
    activeColor: {
      type: String,
      default() {
        return '#00BCD4';
      }
    }
  },
  data () {
    return {
      curTab: this.activeTab
    };
  },
  watch: {
    activeTab: {
      handler (activeTab) {
        this.curTab = activeTab;
        this.$nextTick(() => {
          this.transform();
        })
      }
    }
  },
  mounted() {
    // 为什么不直接在watch activeTab上加上immediately,因为ssr会因为使用document报错.
    const self = this;
    this.$nextTick(() => {
      this.transform();
    });
    window.addEventListener("resize", function(){
        self.transform();
    });
  },
  methods: {
    handleClick (e, tab) {
      if (this.curTab !== tab.id) {
        this.curTab = tab.id;
        this.$nextTick(() => {
          this.transform();
        });
        this.$emit('active-change', tab);
      }
    },
    transform () {
      const activeLi = document.querySelector('.i-tab.is-active');
      const activeBar = document.querySelector('.i-tabs .i-tabs__active-bar');
      const w = activeLi.clientWidth;
      const left = activeLi.offsetLeft;
      if (typeof w !== 'undefined' && typeof left !== 'undefined') {
        activeBar.style.width = w + 'px';
        activeBar.style.left = left + 'px';
      }
    }
  }
};
</script>
<style scoped>
.i-tabs{
  width: 100%;
  height: 36px;
  font-size: 14px;
  color: #8391a5;
  transform: translateX()
}
.i-tabs ul {
  width: 100%;
  height: 100%;
}
.i-tabs li{
  float: left;
  width: 33.3%;
  text-align: center;
  line-height: 36px;
}
.i-tabs li:hover{
  color: #1f2d3d;
  cursor: pointer;
}
.tabs-wp{
  width: 100%;
  height: 100%;
  position: relative;
}
.i-tabs__active-bar{
  position: absolute;
  width: 0px;
  height: 3px;
  bottom: 0px;
  transition: all .3s cubic-bezier(.645,.045,.355,1)
}
</style>
