<template>
  <div class="activity-checkin">
    <h2>我的报名活动</h2>

    <!-- 活动列表 -->
    <el-table v-if="activities.length" :data="activities" border style="width: 100%">
      <!-- 活动名称 -->
      <el-table-column prop="activity_title" label="活动名称" width="200" />
      <!-- 活动时间 -->
      <el-table-column prop="activity_time" label="活动时间" width="200">
        <template #default="scope">
          {{ formatDate(scope.row.activity_time) }}
        </template>
      </el-table-column>
      <!-- 活动地点 -->
      <el-table-column prop="activity_location" label="活动地点" width="200" />
      <!-- 活动简介 -->
      <el-table-column prop="activity_description" label="活动简介" />
      <!-- 签到状态 -->
      <el-table-column prop="checkin_status" label="签到状态" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.checkin_status" type="success">已签到</el-tag>
          <el-tag v-else type="info">未签到</el-tag>
        </template>
      </el-table-column>
      <!-- 签到操作 -->
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            v-if="!scope.row.checkin_status"
            type="primary"
            size="small"
            @click="handleCheckin(scope.row.activity_id)"
          >
            签到
          </el-button>
          <el-button v-else type="default" size="small" disabled>已签到</el-button>
        </template>
      </el-table-column>
    </el-table>

    <p v-else>暂无报名活动</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserRegisteredActivities, checkInActivity } from '@renderer/api'
import { formatDate } from '@renderer/utils/time'
import { isAxiosError } from 'axios'

// 用户 ID（假设从 localStorage 获取）
const userId = Number(localStorage.getItem('user_id'))

// 活动列表
const activities = ref<
  {
    activity_id: number
    activity_title: string
    activity_time: string
    activity_location: string
    activity_description: string
    checkin_status: boolean // 新增字段，表示签到状态
  }[]
>([])

// 获取用户报名的活动列表
const fetchActivities = async (): Promise<void> => {
  try {
    const { data } = await getUserRegisteredActivities(userId)
    activities.value = data.registered_activities || []
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '获取报名活动列表失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 签到活动
const handleCheckin = async (activityId: number): Promise<void> => {
  try {
    const { data } = await checkInActivity(activityId)
    ElMessage.success(data.message || '签到成功！')
    fetchActivities() // 刷新活动列表
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '签到失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 页面加载时获取活动列表
onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.activity-checkin {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 20px;
}
</style>
