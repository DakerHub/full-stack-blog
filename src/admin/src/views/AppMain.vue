<template>
  <el-container class="main-container">
    <el-header class="default-primary-color">
      <TheHeader/>
    </el-header>
    <el-container>
      <el-aside :style="{width:sideBarWidth}">
        <el-button
          class="menu-collapse-btn"
          :style="{width:sideBarWidth}"
          @click="isCollapse=!isCollapse">
            <i :class="menuBtnIcon" :title="menuBtnTitle"></i>
        </el-button>
        <el-menu
          :default-active="initPath"
          :collapse="isCollapse"
          ref="elMenu"
          router
          active-text-color="#00BCD4">
          <el-menu-item index="/home">
            <i class="iconfont icon-zhuye"></i>
            <span slot="title">概览</span>
          </el-menu-item>
          <el-menu-item index="/post">
            <i class="iconfont icon-wenzhang"></i>
            <span slot="title">文章管理</span>
          </el-menu-item>
          <el-menu-item index="/commont">
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
          <el-menu-item index="/user">
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
            :name="item.name">
            <span class="tab-label" slot="label" :title="item.title">
              <i v-if="item.iconClass" :class="item.iconClass"></i><!-- 
                取消间隔
               --><span>{{item.title}}</span>
            </span>
          </el-tab-pane>
        </el-tabs>
        <el-main class="super-light-primary-color">
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
      isCollapse: false
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
    },
    sideBarWidth() {
      return this.isCollapse ? '65px' : '160px';
    },
    menuBtnIcon() {
      return this.isCollapse ? 'iconfont icon-shouqi reverse' : 'iconfont icon-shouqi';
    },
    menuBtnTitle() {
      return this.isCollapse ? '展开' : '收起';
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
.el-aside{
  position: relative;
  overflow-x: hidden;
  background-color: transparent;
}
.el-menu{
  padding-top: 30px;
  height: calc(100% - 30px);
}
.el-tabs{
  padding: 10px 10px 0 10px;
  box-shadow: 0px -2px 6px 1px #1f2c79;
  position: relative;
  z-index: 1;
}
.tab-label{
  max-width: 100px;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tab-label .iconfont{
  width: auto;
}
.menu-collapse-btn{
  position: absolute;
  top: 0px;
  left: 0px;
  height: 30px;
  z-index: 1;
  text-align: center;
  border: none;
  background-color: transparent;
}
.icon-shouqi{
  transition: transform .3s ease-out;
}
.icon-shouqi.reverse{
  transform: rotateY(180deg);
}
</style>
