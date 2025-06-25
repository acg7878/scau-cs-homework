<template>
  <div class="club-registration">
    <h2>社团报名</h2>
    <el-table :data="clubList" border style="width: 100%">
      <!-- 社团名称 -->
      <el-table-column prop="club_name" label="社团名称" width="200" />
      <!-- 社团简介 -->
      <el-table-column label="社团简介">
        <template #default="scope">
          <div class="text-ellipsis">{{ scope.row.club_introduction }}</div>
        </template>
      </el-table-column>
      <!-- 联系方式 -->
      <el-table-column prop="contact_info" label="联系方式" width="200" />
      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleApply(scope.row)"> 报名 </el-button>
          <el-button type="info" size="small" @click="openDialog(scope.row)"> 查看详细 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看详细的对话框 -->
    <el-dialog v-model="dialogVisible" title="社团详情" width="500px">
      <div v-if="selectedClub">
        <p><strong>社团名称：</strong>{{ selectedClub.club_name }}</p>
        <p><strong>社团简介：</strong>{{ selectedClub.club_introduction }}</p>
        <p><strong>联系方式：</strong>{{ selectedClub.contact_info }}</p>
        <p><strong>活动场地：</strong>{{ selectedClub.activity_venue }}</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getClubList, applyToJoinClub } from '@renderer/api'
import { AxiosError } from 'axios'

// 定义社团对象的接口
interface Club {
  club_id: number
  club_name: string
  club_introduction: string
  contact_info: string
  activity_venue: string
}

// 类型守卫函数
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined
}

// 社团列表数据
const clubList = ref<Club[]>([])

// 对话框状态和选中的社团
const dialogVisible = ref(false)
const selectedClub = ref<Club | null>(null)

// 获取社团列表
const fetchClubList = async (): Promise<void> => {
  try {
    const { data } = await getClubList()
    clubList.value = data.clubs || []
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { error?: string }
      ElMessage.error(data?.error || '请求失败，请稍后重试！')
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

const handleApply = async (club: Club): Promise<void> => {
  const userId = localStorage.getItem('user_id')
  console.log(userId)
  console.log(club.club_id)
  if (!userId) {
    ElMessage.warning('用户未登录，请先登录')
    return
  }

  try {
    const response = await applyToJoinClub(Number(userId), club.club_id)

    if (response.status === 200) {
      ElMessage.success(`成功报名社团：${club.club_name}`)
    } else {
      ElMessage.error(response.data.error || '报名失败，请稍后重试！')
    }
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
const openDialog = (club: Club): void => {
  selectedClub.value = club
  dialogVisible.value = true
}

// 关闭对话框
const closeDialog = (): void => {
  dialogVisible.value = false
  selectedClub.value = null
}

// 页面加载时获取社团列表
onMounted(() => {
  fetchClubList()
})
</script>

<style scoped>
.club-registration {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 20px;
}

.text-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制显示两行 */
  line-clamp: 2; /* 标准属性，增加兼容性 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
