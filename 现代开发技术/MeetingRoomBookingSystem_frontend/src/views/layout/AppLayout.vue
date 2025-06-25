<template>
  <el-container class="layout-container">
    <el-header class="layout-header"><Header /></el-header>
    <el-container class="layout-body">
      <el-aside class="layout-aside"><Sidebar /></el-aside>
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Header from '@/views/layout/AppHeader.vue';
import Sidebar from '@/views/layout/AppSidebar.vue';

//location.reload();
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh; // 撑满整个视口
}

.layout-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.layout-body {
  height: calc(100vh - 60px); // 除去 header 后的高度
}

.layout-aside {
  width: 220px;
  background-color: #f5f7fa;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
}

.layout-main {
  padding: 20px;
  overflow: auto;
  background-color: #fff;
}
</style>
