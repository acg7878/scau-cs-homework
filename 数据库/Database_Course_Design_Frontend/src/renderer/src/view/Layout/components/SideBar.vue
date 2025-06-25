<template>
  <el-menu
    class="el-menu-vertical"
    :default-active="activeMenu"
    background-color="#ffffff"
    text-color="#333"
    active-text-color="#409eff"
    router
  >
    <!-- 社团管理菜单 -->
    <el-sub-menu index="club">
      <template #title>
        <i class="el-icon-s-flag"></i>
        <span>社团管理</span>
      </template>
      <el-menu-item
        v-for="item in clubMenuItems"
        :key="item.path"
        :index="`/dashboard/${item.path}`"
      >
        <i :class="item.meta?.icon" class="menu-icon"></i>
        <span>{{ item.meta?.title }}</span>
      </el-menu-item>
    </el-sub-menu>

    <!-- 活动管理菜单 -->
    <el-sub-menu index="activity">
      <template #title>
        <i class="el-icon-s-opportunity"></i>
        <span>活动管理</span>
      </template>
      <el-menu-item
        v-for="item in activityMenuItems"
        :key="item.path"
        :index="`/dashboard/${item.path}`"
      >
        <i :class="item.meta?.icon" class="menu-icon"></i>
        <span>{{ item.meta?.title }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hasPermission } from '@renderer/utils/permission'
// 获取当前路由和路由配置
const route = useRoute()
const router = useRouter()

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 筛选社团相关的菜单项
// 获取 Dashboard 子路由
const dashboardChildren = computed(
  () => router.getRoutes().find((r) => r.name === 'Dashboard')?.children || []
)

// 社团菜单
const clubMenuItems = computed(() =>
  dashboardChildren.value.filter(
    (child) =>
      [
        'club-registration',
        'create-club',
        'club-approval',
        'club-registration-approval',
        'club-member'
      ].includes(child.name as string) && hasPermission(child)
  )
)

// 活动菜单
const activityMenuItems = computed(() =>
  dashboardChildren.value.filter(
    (child) =>
      [
        'activity-registration',
        'activity-checkin',
        'activity-payment',
        // 'activity-payment',
        'create-activity',
        'activity-registration-approval'
      ].includes(child.name as string) && hasPermission(child)
  )
)
</script>

<style scoped>
.el-menu-vertical {
  height: 100%;
  border-right: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-size: 14px;
}

.el-menu-vertical .el-sub-menu__title {
  font-weight: bold;
  color: #333;
}

.el-menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.el-menu-item:hover {
  background-color: #f0f0f0;
}

.el-menu-item .menu-icon {
  margin-right: 10px;
  font-size: 16px;
  color: #666;
}

.el-menu-item:hover .menu-icon {
  color: #409eff;
}

.el-sub-menu__title {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.el-sub-menu__title:hover {
  background-color: #f0f0f0;
}

.el-sub-menu__title i {
  margin-right: 10px;
  font-size: 18px;
  color: #409eff;
}
</style>
