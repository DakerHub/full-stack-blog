<template>
  <el-container class="main-container">
    <el-header class="default-primary-color">
      <TheHeader/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="0">
            <i class="iconfont icon-wenzhang"></i>
            <span slot="title">概览</span>
          </el-menu-item>
          <el-menu-item index="1">
            <i class="iconfont icon-wenzhang"></i>
            <span slot="title">文章管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="iconfont icon-pinglun"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="3">
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
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import TheHeader from './TheHeader';

export default {
  name: 'AppMain',
  components: {
    TheHeader
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
