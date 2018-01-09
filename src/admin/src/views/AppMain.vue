<template>
  <el-container class="main-container">
    <el-header class="default-primary-color">
      <TheHeader/>
    </el-header>
    <el-container>
      <el-aside width="160px">
        <el-menu :default-active="initPath" ref="elMenu" router active-text-color="#00BCD4">
          <el-menu-item index="/home">
            <i class="iconfont icon-wenzhang"></i>
            <span slot="title">概览</span>
          </el-menu-item>
          <el-menu-item index="/post">
            <i class="iconfont icon-wenzhang"></i>
            <span slot="title">文章管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="iconfont icon-pinglun"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="/tag">
            <i class="iconfont icon-shengqian"></i>
            <span slot="title">标签管理</span>
          </el-menu-item>
          <el-menu-item index="/category">
            <i class="iconfont icon-fenlei"></i>
            <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="iconfont icon-yonghu"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="overflow-hidden" direction="vertical">
        <el-tabs 
          v-model="$store.state.activedTab"
          v-show="$store.state.tabs.length > 0"
          type="card"
          closable
          @tab-remove="handleRemoveTab"
          @tab-click="changeView">
          <el-tab-pane
            v-for="item in $store.state.tabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import TheHeader from './TheHeader';
import elTab from './../assets/mixins/elTab.js';

export default {
  name: 'AppMain',
  components: {
    TheHeader
  },
  mixins: [elTab],
  data () {
    return {
    }
  },
  computed: {
    initPath () {
      let path = this.$route.path;
      let result = '';
      path = '/' + path.split('/')[1];
      if (path === '/' || path === '/home') {
        result = '/home';
      } else {
        result = path;
      }
      this.$nextTick(() => {
        this.$refs.elMenu && (this.$refs.elMenu.activeIndex = result);
      });
      return result;
    }
  },
  methods: {
    handleRemoveTab(val) {
      this.removeTab(val);
      if (this.$store.state.tabs.length === 0) {
        this.$router.push('/home');
      }
    }
  }
}
</script>

<style scoped>
.main-container{
  height: 100%;
}
.el-menu{
  height: 100%;
}
.el-tabs{
  padding: 10px 10px 0 10px;
  box-shadow: 0px -2px 6px 1px #1f2c79;
  position: relative;
  z-index: 1;
}
</style>
