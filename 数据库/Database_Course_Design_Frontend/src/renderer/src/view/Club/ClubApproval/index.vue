<template>
  <div class="club-approval">
    <h2>社团审批</h2>
    <el-table :data="approvalList" border style="width: 100%">
      <!-- 申请人 -->
      <el-table-column prop="applicant_name" label="申请人" width="150" />
      <!-- 社团名称 -->
      <el-table-column prop="club_name" label="社团名称" width="200" />
      <!-- 申请时间 -->
      <el-table-column prop="approval_time" label="申请时间" width="200">
        <template #default="scope">
          {{ formatDate(scope.row.approval_time) }}
        </template>
      </el-table-column>
      <!-- 审核状态 -->
      <el-table-column prop="approval_status" label="审核状态" width="150">
        <template #default="scope">
          <el-tag
            :type="
              scope.row.approval_status === '通过'
                ? 'success'
                : scope.row.approval_status === '不通过'
                  ? 'danger'
                  : 'info'
            "
          >
            {{ scope.row.approval_status }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <!-- 仅当审批状态为“待审核”时显示审批按钮 -->
          <el-button
            v-if="scope.row.approval_status === '待审核'"
            type="primary"
            size="small"
            @click="openDialog(scope.row)"
          >
            审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 审批对话框 -->
    <el-dialog v-model="dialogVisible" title="审批社团申请" width="500px">
      <div v-if="selectedApproval">
        <p><strong>申请人：</strong>{{ selectedApproval.applicant_name }}</p>
        <p><strong>社团名称：</strong>{{ selectedApproval.club_name }}</p>
        <p><strong>申请时间：</strong>{{ formatDate(selectedApproval.approval_time) }}</p>
        <el-form :model="approvalForm" label-width="100px">
          <el-form-item label="审批意见">
            <el-input
              v-model="approvalForm.approvalOpinion"
              type="textarea"
              placeholder="请输入审批意见"
            />
          </el-form-item>
          <el-form-item label="审批状态">
            <el-radio-group v-model="approvalForm.approvalStatus">
              <el-radio label="通过">通过</el-radio>
              <el-radio label="不通过">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitApproval">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getClubApplicationList, approveClubApplicationRequest } from '@renderer/api'
import { isAxiosError } from 'axios'
import { formatDate } from '@renderer/utils/time'

// 定义审批对象的接口
interface Approval {
  approval_id: number
  applicant_name: string
  club_name: string
  approval_time: string
  approval_status: string
  approval_opinion: string
}

// 审批列表数据
const approvalList = ref<Approval[]>([])

// 对话框状态和选中的审批
const dialogVisible = ref(false)
const selectedApproval = ref<Approval | null>(null)

// 审批表单数据
const approvalForm = ref({
  approvalStatus: '待审核', // 审批状态：待审核、通过、不通过
  approvalOpinion: '' // 审批意见
})

// 获取审批列表
const fetchApprovalList = async (): Promise<void> => {
  try {
    const { data } = await getClubApplicationList()
    approvalList.value = data.approvals || []
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '请求失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 打开对话框
const openDialog = (approval: Approval): void => {
  selectedApproval.value = approval
  approvalForm.value.approvalStatus = approval.approval_status || '待审核' // 设置审批状态
  approvalForm.value.approvalOpinion = approval.approval_opinion || '' // 设置审批意见
  dialogVisible.value = true
}

// 关闭对话框
const closeDialog = (): void => {
  dialogVisible.value = false
  selectedApproval.value = null
}

// 提交审批
const submitApproval = async (): Promise<void> => {
  if (!selectedApproval.value) return

  try {
    await approveClubApplicationRequest(
      selectedApproval.value.approval_id,
      approvalForm.value.approvalStatus,
      approvalForm.value.approvalOpinion
    )
    ElMessage.success('审批提交成功！')
    dialogVisible.value = false
    fetchApprovalList() // 重新获取审批列表
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '请求失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 页面加载时获取审批列表
onMounted(() => {
  fetchApprovalList()
})
</script>

<style scoped>
.club-approval {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
