<template>
 
    <div class="header">
      <h1>会议室预订系统</h1>
      <div class="right-content">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar :size="40" :src="userInfo.avatar"></el-avatar>
            <el-icon class="el-icon-arrow-down el-icon--right"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item> -->
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 删除通知对话框 -->

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { logout } from '@/api/auth';
import { ElMessage } from 'element-plus';
import avatarImg from '@/assets/touxiang.svg';
const router = useRouter();
const userInfo = ref({
  name: '张三',
  avatar: avatarImg
});

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile');
      break;
    case 'settings':
      router.push('/settings');
      break;
    case 'logout':
      logout(
        () => {
          router.push('/');
        },
        (message) => {
          ElMessage.error(message);
        }
      );
      break;
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
  background-color: #f5f5f5; /* 添加灰色背景 */
  border-bottom: 1px solid #e0e0e0; /* 添加底部边框增强区分度 */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.header {
  animation: fadeIn 0.5s ease-in-out;
  /* background-color: #f5f5f5; */
  border-bottom: 1px solid #e0e0e0; /* 添加底部边框增强区分度 */
  display: flex;
  justify-content: space-between; 
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box; 
}

.right-content {
  display: flex;
  align-items: center;
}
</style>