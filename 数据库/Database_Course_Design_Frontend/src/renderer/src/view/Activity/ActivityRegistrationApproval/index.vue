<template>
  <div class="activity-approval">
    <h2>活动报名审批</h2>

    <!-- 社团选择下拉框 -->
    <el-select v-model="selectedClub" placeholder="选择社团" @change="fetchActivities">
      <el-option
        v-for="club in clubs"
        :key="club.club_id"
        :label="club.club_name"
        :value="club.club_id"
      />
    </el-select>

    <!-- 报名信息表格 -->
    <el-table v-if="activities.length" :data="activities" border style="width: 100%">
      <el-table-column prop="activity_title" label="活动名称" width="200" />
      <el-table-column prop="user_name" label="用户名称" width="200" />
      <el-table-column prop="registration_status" label="报名状态" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.registration_status === 'pending'" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.registration_status === 'accepted'" type="success"
            >已通过</el-tag
          >
          <el-tag v-else-if="scope.row.registration_status === 'rejected'" type="danger"
            >已拒绝</el-tag
          >
          <el-tag v-else-if="scope.row.registration_status === 'cancel'" type="info">已取消</el-tag>
          <el-tag v-else type="warning">状态未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            v-if="scope.row.registration_status === 'pending'"
            type="success"
            size="small"
            @click="approveRegistration(scope.row.registration_id)"
          >
            通过
          </el-button>
          <el-button
            v-if="scope.row.registration_status === 'pending'"
            type="danger"
            size="small"
            @click="rejectRegistration(scope.row.registration_id)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <p v-else>暂无活动报名需要审批</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { isAxiosError } from 'axios'
import {
  getOwnedClubs,
  getActivityRegistrationsByClub,
  reviewActivityRegistration
} from '@renderer/api'

// 社团列表
const clubs = ref<{ club_id: number; club_name: string }[]>([])

// 当前选中的社团 ID
const selectedClub = ref<number | null>(null)

// 活动报名记录
const activities = ref<
  {
    registration_id: number
    activity_title: string
    user_name: string
    registration_status: string
    payment_status: string
    registration_date: string
  }[]
>([])

// 获取用户拥有的社团
const fetchClubs = async (): Promise<void> => {
  try {
    const { data } = await getOwnedClubs()
    clubs.value = data.owned_clubs || []
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '获取社团列表失败')
    } else {
      ElMessage.error('未知错误，请稍后重试')
    }
  }
}

// 获取社团的报名信息
const fetchActivities = async (): Promise<void> => {
  if (!selectedClub.value) return
  try {
    const { data } = await getActivityRegistrationsByClub(selectedClub.value)
    activities.value = data.registrations || []
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error)
    } else {
      ElMessage.error('未知错误，请稍后重试')
    }
  }
}

// 通过报名（模仿 approveApplication 风格）
const approveRegistration = async (registrationId: number): Promise<void> => {
  try {
    await reviewActivityRegistration(registrationId, 'accepted')
    ElMessage.success('已通过该报名！')
    fetchActivities()
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '操作失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 拒绝报名（模仿 approveApplication 风格）
const rejectRegistration = async (registrationId: number): Promise<void> => {
  try {
    await reviewActivityRegistration(registrationId, 'rejected')
    ElMessage.success('已拒绝该报名！')
    fetchActivities()
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '操作失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 页面加载时获取社团列表
onMounted(fetchClubs)
</script>

<style scoped>
.activity-approval {
  padding: 20px;
  background-color: #fff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}
h2 {
  margin-bottom: 20px;
}
.el-select {
  margin-bottom: 20px;
  width: 300px;
}
</style>
