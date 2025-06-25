<template>
  <el-menu :default-active="$route.path" router class="sidebar">
    <el-menu-item index="/">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </el-menu-item>
    
    <template v-for="item in menuRoutes" :key="item.path">
      <!-- 如果有子路由，渲染 el-sub-menu -->
      <el-sub-menu v-if="item.children" :index="item.path">
        <template #title>
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.path"
          :index="child.path"
        >
          {{ child.meta.title }}
        </el-menu-item>
      </el-sub-menu>

      <!-- 如果没有子路由，渲染 el-menu-item -->
      <el-menu-item v-else :index="item.path">
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>



<script setup>
import { usePermissionStore } from "@/stores/modules/permissionStore";
import { computed } from "vue";

const permissionStore = usePermissionStore();
const menuRoutes = computed(() => permissionStore.authRoutes);
</script>


<style lang="scss" scoped>

</style>

