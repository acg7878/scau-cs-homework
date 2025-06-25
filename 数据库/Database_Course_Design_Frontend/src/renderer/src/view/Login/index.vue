<template>
  <div class="login-container">
    <!-- 左侧 3/4 区域 -->
    <div class="left-section">
      <h1>欢迎使用</h1>
    </div>

    <!-- 右侧 1/4 区域 -->
    <div class="right-section">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label for="username">用户名</label>
          <input id="username" v-model="username" type="text" placeholder="请输入用户名" />
        </div>
        <div class="form-item">
          <label for="password">密码</label>
          <input id="password" v-model="password" type="password" placeholder="请输入密码" />
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>

      <!-- 注册按钮 -->
      <div class="register-link">
        <p>还没有账号？</p>
        <router-link to="/register" class="register-button">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { loginUser } from '@renderer/api'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { getUserRole } from '@renderer/api/'

// 中文角色映射为英文
const roleMapping: Record<string, string> = {
  社长: 'president',
  社员: 'member',
  管理员: 'admin'
}

// 调用接口并存储到 localStorage
const fetchAndStoreUserRole = async (): Promise<void> => {
  try {
    // 调用接口获取用户权限
    const { data } = await getUserRole() // 替换为实际接口地址
    const userType = data.user_type // 假设后端返回的字段是 user_type，例如 "社员"

    // 映射中文角色为英文
    const mappedRole = roleMapping[userType]

    // 存储到 localStorage
    localStorage.setItem('user_role', mappedRole)

    console.log(`用户角色已存储为: ${mappedRole}`)
  } catch (error) {
    console.error('获取用户权限失败:', error)
  }
}

// 调用函数

interface ErrorResponse {
  error: string
}

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = async (): Promise<void> => {
  try {
    // 简单的前端验证
    if (!username.value || !password.value) {
      ElNotification.error({
        title: '错误',
        message: '请输入用户名和密码'
      })
      return
    }
    // 调用登录接口
    const { data, status } = await loginUser(username.value, password.value)
    // 登录成功处理
    if (status === 200) {
      ElNotification.success({
        title: '成功',
        message: data.message || '登录成功'
      })
      await fetchAndStoreUserRole() // 添加await，保证获取到权限再进入登录
      localStorage.setItem('user_id', data.user_id)
      router.push('/dashboard')
    } else {
      // 后端返回的错误信息
      ElNotification.error({
        title: '登录失败',
        message: data.error
      })
    }
  } catch (error) {
    // 处理网络错误
    const axiosError = error as AxiosError
    const errorMessage = (axiosError.response?.data as ErrorResponse)?.error || '网络异常'

    ElNotification.error({
      title: '请求错误',
      message: errorMessage
    })
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.login-container {
  display: flex;
  height: 100vh;
}

.left-section {
  flex: 3;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.right-section {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 15px;
  width: 100%;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #66b1ff;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-button {
  color: #409eff;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.register-button:hover {
  text-decoration: underline;
}
</style>
