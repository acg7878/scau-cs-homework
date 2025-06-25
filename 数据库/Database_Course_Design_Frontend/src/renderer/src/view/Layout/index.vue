<template>
  <el-container class="layout">
    <!-- 头部导航栏 -->
    <el-header height="60px" class="tool-header">
      <ToolHeader />
    </el-header>

    <!-- 主体内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <SideBar />
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="layout-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
// 引入头部、侧边栏和内容组件
import ToolHeader from './components/ToolHeader.vue'
import SideBar from './components/SideBar.vue'
</script>

<style scoped>
.layout {
  height: 100vh;
}

.tool-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.sidebar {
  background-color: #f5f5f5;
  border-right: 1px solid #dcdfe6;
}

.layout-content {
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
}
</style>
