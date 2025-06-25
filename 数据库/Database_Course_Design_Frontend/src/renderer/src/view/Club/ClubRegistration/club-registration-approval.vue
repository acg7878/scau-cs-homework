<template>
  <div class="club-member-applications">
    <h2>社团成员申请审批</h2>
    <el-table v-if="applications.length" :data="applications" border style="width: 100%">
      <!-- 社团名称 -->
      <el-table-column prop="club_name" label="社团名称" width="200" />
      <!-- 申请人姓名 -->
      <el-table-column prop="user_name" label="申请人姓名" width="150" />
      <!-- 申请时间 -->
      <el-table-column prop="apply_date" label="申请时间" width="200">
        <template #default="scope">
          {{ formatDate(scope.row.apply_date) }}
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="status" label="状态" width="150">
        <template #default="scope">
          <el-tag
            :type="
              scope.row.status === 'pending'
                ? 'info'
                : scope.row.status === 'approved'
                  ? 'success'
                  : 'danger'
            "
          >
            {{
              scope.row.status === 'pending'
                ? '待审核'
                : scope.row.status === 'approved'
                  ? '已通过'
                  : '已拒绝'
            }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'pending'"
            type="primary"
            size="small"
            @click="approveApplication(scope.row.apply_id)"
          >
            同意
          </el-button>
          <el-button
            v-if="scope.row.status === 'pending'"
            type="danger"
            size="small"
            @click="rejectApplication(scope.row.apply_id)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-else>暂无申请记录</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllMemberApplications, approveMemberApplication } from '@renderer/api'
import { formatDate } from '@renderer/utils/time'
import { isAxiosError } from 'axios'

// 申请列表
const applications = ref([])

// 获取申请列表
const fetchApplications = async (): Promise<void> => {
  try {
    const { data } = await getAllMemberApplications()
    applications.value = data.applications || []
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '获取申请列表失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 同意申请
const approveApplication = async (applyId: number): Promise<void> => {
  try {
    await approveMemberApplication(applyId, 'approved') // 调用接口
    ElMessage.success('已同意该申请！')
    fetchApplications() // 刷新列表
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '操作失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 拒绝申请
const rejectApplication = async (applyId: number): Promise<void> => {
  try {
    await approveMemberApplication(applyId, 'rejected') // 调用接口
    ElMessage.success('已拒绝该申请！')
    fetchApplications() // 刷新列表
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '操作失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 页面加载时获取申请列表
onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.club-member-applications {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 20px;
}
</style>
