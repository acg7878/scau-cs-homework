<template>
  <header class="tool-header">
    <!-- 左侧 Logo -->
    <div class="logo">社团管理系统</div>

    <!-- 右侧操作区域 -->
    <div class="actions">
      <button class="logout-button" @click="handleLogout">退出</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { logoutUser } from '@renderer/api'
import { ElNotification } from 'element-plus'
const router = useRouter()
const handleLogout = async (): Promise<void> => {
  try {
    // 调用退出接口
    const { data } = await logoutUser()
    // 跳转到登录页面
    router.push('/login')
    ElNotification.success({
      title: '登出成功',
      message: data.message || '登出成功'
    })
  } catch (error) {
    console.error('退出失败:', error)
    alert('退出失败，请重试！')
  }
}
</script>

<style scoped>
.tool-header {
  display: flex;
  justify-content: space-between; /* 左右两侧对齐 */
  align-items: center;
  width: 100%; /* 确保父容器占满宽度 */
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.actions {
  display: flex;
  align-items: center;
}

.logout-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #d9363e;
}
</style>
