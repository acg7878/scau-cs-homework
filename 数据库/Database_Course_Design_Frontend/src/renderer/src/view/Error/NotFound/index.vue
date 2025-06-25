<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = (): void => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f9f9f9;
}

.not-found h1 {
  font-size: 96px;
  margin: 0;
  color: #333;
}

.not-found p {
  font-size: 18px;
  color: #666;
  margin: 16px 0;
}

.not-found .el-button {
  margin-top: 20px;
}
</style>
