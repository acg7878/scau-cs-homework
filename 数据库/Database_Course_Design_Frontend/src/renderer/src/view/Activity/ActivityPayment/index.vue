<template>
  <div class="activity-payment">
    <h2>活动缴费</h2>

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
      <!-- 缴费状态 -->
      <el-table-column prop="payment_status" label="缴费状态" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.payment_status === '已缴费'" type="success">已缴费</el-tag>
          <el-tag v-else type="info">未缴费</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            v-if="scope.row.payment_status !== '已缴费'"
            type="primary"
            size="small"
            @click="handlePayment(scope.row.registration_id, '已缴费')"
          >
            缴费
          </el-button>
          <el-button
            v-else
            type="danger"
            size="small"
            @click="handlePayment(scope.row.registration_id, '未缴费')"
          >
            退费
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <p v-else>暂无需要缴费的活动</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserRegisteredActivities, updatePaymentStatus } from '@renderer/api'
import { formatDate } from '@renderer/utils/time'
import { isAxiosError } from 'axios'

// 用户 ID（假设从 localStorage 获取）
const userId = Number(localStorage.getItem('user_id'))

// 活动列表
const activities = ref<
  {
    registration_id: number
    activity_title: string
    activity_time: string
    activity_location: string
    registration_status: string
    payment_status: string
  }[]
>([])

// 获取用户报名的活动列表
const fetchActivities = async (): Promise<void> => {
  try {
    const { data } = await getUserRegisteredActivities(userId)
    activities.value = data.registered_activities || [] // 直接赋值，无需过滤
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '获取报名活动列表失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 更新缴费状态
const handlePayment = async (registrationId: number, status: string): Promise<void> => {
  console.log('调用 handlePayment 参数:', { registrationId, status }) // 调试日志
  if (!registrationId || !status) {
    ElMessage.error('缺少必要的参数，请稍后重试！')
    return
  }
  try {
    const { data } = await updatePaymentStatus(registrationId, status)
    console.log('接口返回数据:', data) // 调试日志
    ElMessage.success(data.message || (status === '已缴费' ? '缴费成功！' : '退费成功！'))
    fetchActivities() // 刷新活动列表
  } catch (error: unknown) {
    console.error('接口调用错误:', error) // 调试日志
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '操作失败，请稍后重试！')
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
.activity-payment {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 20px;
}
</style>
