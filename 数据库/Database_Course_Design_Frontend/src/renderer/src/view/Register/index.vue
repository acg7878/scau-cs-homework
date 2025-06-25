<template>
  <div class="register-container">
    <!-- 注册表单 -->
    <div class="form-section">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-item">
          <label for="username">用户名</label>
          <input id="username" v-model="username" type="text" placeholder="请输入用户名" />
        </div>
        <div class="form-item">
          <label for="password">密码</label>
          <input id="password" v-model="password" type="password" placeholder="请输入密码" />
        </div>
        <div class="form-item">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
          />
        </div>
        <div class="form-item">
          <label for="role">注册身份</label>
          <select id="role" v-model="role">
            <option value="社员">社员</option>
            <option value="管理员">管理员</option>
          </select>
        </div>
        <div class="button-group">
          <!-- 返回按钮 -->
          <router-link to="/login" class="register-button return-button">返回</router-link>
          <!-- 注册按钮 -->
          <button type="submit" class="register-button">注册</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { registerUser } from '@renderer/api' // 引入封装的注册接口
import { AxiosError } from 'axios'

// 表单数据
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('社员') // 默认身份为社团成员

// 注册处理函数
const handleRegister = async (): Promise<void> => {
  if (password.value !== confirmPassword.value) {
    ElNotification({
      title: '错误',
      message: '两次输入的密码不一致',
      type: 'error',
      duration: 3000
    })
    return
  }

  try {
    // 调用封装的注册接口
    await registerUser(username.value, password.value, role.value)
    ElNotification({
      title: '成功',
      message: '注册成功！',
      type: 'success',
      duration: 3000
    })
    // 重定向到登录页面
    window.location.href = '/#/login'
  } catch (error) {
    // 检查 error 是否为 AxiosError 类型
    if (error instanceof AxiosError) {
      // 读取后端返回的 JSON 数据
      const errorMessage = error.response?.data?.error || '注册失败，请稍后再试'
      ElNotification({
        title: '错误',
        message: errorMessage,
        type: 'error',
        duration: 3000
      })
      console.error('后端返回的错误:', error.response?.data)
    } else {
      // 处理非 AxiosError 的情况
      ElNotification({
        title: '错误',
        message: '发生未知错误，请稍后再试',
        type: 'error',
        duration: 3000
      })
      console.error('未知错误:', error)
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.form-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 350px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-item input,
.form-item select {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.register-button {
  width: 48%;
  max-width: 140px;
  padding: 8px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.register-button:hover {
  background-color: #66b1ff;
}

.return-button {
  background-color: #f56c6c;
}

.return-button:hover {
  background-color: #ff8787;
}
</style>
