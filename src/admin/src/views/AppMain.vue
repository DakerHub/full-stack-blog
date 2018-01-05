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
          <el-menu-item index="4">
            <i class="iconfont icon-fenlei"></i>
            <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="iconfont icon-yonghu"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-tabs 
            v-model="$store.state.activedTab"
            v-show="$store.state.tabs.length > 0"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="changeView">
            <el-tab-pane
              v-for="item in $store.state.tabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
            </el-tab-pane>
          </el-tabs>
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
    removeTab(val) {
      this.$store.commit('removeTab', val);
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
</style>
