<template>
  <div class="error-container">
    <div class="error-content">
      <el-result
        icon="warning"
        title="404 页面未找到"
        sub-title="抱歉，您访问的页面不存在"
      >
        <template #extra>
          <el-button type="primary" @click="goHome">返回首页</el-button>
          <el-button @click="goBack">返回上一页</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.error-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;

  .error-content {
    text-align: center;
    padding: 20px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>