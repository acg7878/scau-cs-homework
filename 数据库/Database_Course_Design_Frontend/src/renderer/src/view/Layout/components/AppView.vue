<template>
  <div class="app-view">
    <!-- 渲染子路由内容 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 不需要额外逻辑
</script>

<style scoped>
.app-view {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}
</style>