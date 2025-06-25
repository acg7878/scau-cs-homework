<template>
  <div class="create-activity">
    <h1>创建活动</h1>
    <el-form ref="activityFormRef" :model="activityForm" :rules="rules" label-width="120px">
      <!-- 所属社团 -->
      <el-form-item label="所属社团" prop="clubId">
        <el-select v-model="activityForm.clubId" placeholder="请选择所属社团">
          <el-option
            v-for="club in ownedClubs"
            :key="club.club_id"
            :label="club.club_name"
            :value="club.club_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 活动标题 -->
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="activityForm.title" placeholder="请输入活动标题"></el-input>
      </el-form-item>

      <!-- 活动时间 -->
      <el-form-item label="活动时间" prop="time">
        <el-date-picker
          v-model="activityForm.time"
          type="datetime"
          placeholder="选择活动时间"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <!-- 活动地点 -->
      <el-form-item label="活动地点" prop="location">
        <el-input v-model="activityForm.location" placeholder="请输入活动地点"></el-input>
      </el-form-item>

      <!-- 报名方式 -->
      <el-form-item label="报名方式" prop="registrationMethod">
        <el-select v-model="activityForm.registrationMethod" placeholder="请选择报名方式">
          <el-option label="线上报名" value="online"></el-option>
          <el-option label="线下报名" value="offline"></el-option>
        </el-select>
      </el-form-item>

      <!-- 活动描述 -->
      <el-form-item label="活动描述" prop="description">
        <el-input
          v-model="activityForm.description"
          type="textarea"
          placeholder="请输入活动描述"
          rows="4"
        ></el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { createActivity, getOwnedClubs } from '@renderer/api' // 确保正确引入接口
import { AxiosError } from 'axios'

// 类型守卫函数，用于判断是否为 AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined
}

const activityFormRef = ref<FormInstance | null>(null)
const activityForm = ref({
  clubId: null, // 默认未选择社团
  title: '',
  time: '',
  location: '',
  registrationMethod: '',
  description: ''
})

const ownedClubs = ref<{ club_id: number; club_name: string }[]>([]) // 存储用户拥有的社团

const rules = {
  clubId: [{ required: true, message: '请选择所属社团', trigger: 'change' }],
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  registrationMethod: [{ required: true, message: '请选择报名方式', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }]
}

// 获取用户拥有的社团
const fetchOwnedClubs = async (): Promise<void> => {
  try {
    const response = await getOwnedClubs()
    ownedClubs.value = response.data.owned_clubs || []
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '获取所属社团失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 提交表单
const submitForm = async (): Promise<void> => {
  if (activityFormRef.value) {
    activityFormRef.value.validate(async (valid) => {
      if (valid) {
        if (activityForm.value.clubId === null) {
          ElMessage.error('请选择所属社团')
          return
        }

        try {
          // 格式化时间为 YYYY-MM-DD HH:mm:ss
          const formatDateTime = (date: Date): string => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
          }

          const formattedTime = formatDateTime(new Date(activityForm.value.time))

          const response = await createActivity(
            activityForm.value.title,
            formattedTime, // 使用格式化后的时间
            activityForm.value.location,
            activityForm.value.registrationMethod,
            activityForm.value.description,
            activityForm.value.clubId
          )
          if (response.status === 200) {
            ElMessage.success('活动创建成功！')
            resetForm() // 重置表单
          } else {
            ElMessage.error(response.data.message || '活动创建失败！')
          }
        } catch (error: unknown) {
          if (isAxiosError(error)) {
            const data = error.response?.data as { error?: string }
            ElMessage.error(data?.error || '请求失败，请稍后重试！')
          } else {
            ElMessage.error('未知错误，请稍后重试！')
          }
        }
      } else {
        ElMessage.warning('请填写完整的活动信息！')
      }
    })
  }
}

// 重置表单
const resetForm = (): void => {
  if (activityFormRef.value) {
    activityFormRef.value.resetFields()
  }
}

// 页面加载时获取用户拥有的社团
onMounted(() => {
  fetchOwnedClubs()
})
</script>

<style scoped>
.create-activity {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
