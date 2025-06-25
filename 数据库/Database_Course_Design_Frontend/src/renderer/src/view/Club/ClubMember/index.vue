<template>
  <div class="club-member-container">
    <el-card>
      <div class="header">
        <h2 class="title">成员管理</h2>
        <el-select
          v-model="selectedClub"
          placeholder="请选择社团"
          class="club-select"
          @change="fetchMembers"
        >
          <el-option
            v-for="club in clubs"
            :key="club.club_id"
            :label="club.club_name"
            :value="club.club_id"
          />
        </el-select>
      </div>
      <el-table :data="members" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="member_role" label="角色" width="150" />
        <el-table-column prop="phone" label="联系方式" width="200" />
        <el-table-column prop="email" label="邮箱" width="250" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getClubList, getClubMembers, getOwnedClubs } from '@renderer/api'
import { AxiosError } from 'axios'

// 获取当前用户角色
const userRole = localStorage.getItem('user_role')
const isAdmin = userRole === 'admin'
const isPresident = userRole === 'president' // 例如社长为 leader

// 社团列表
const clubs = ref<{ club_id: number; club_name: string }[]>([])

// 当前选中的社团 ID
const selectedClub = ref<number | null>(null)

// 成员列表
const members = ref<{ username: string; member_role: string; phone: string; email: string }[]>([])

// 获取社团成员
const fetchMembers = async (): Promise<void> => {
  try {
    if (selectedClub.value !== null) {
      const response = await getClubMembers(selectedClub.value.toString())
      members.value = response.data.members || []
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || '获取社团成员失败，请稍后重试！'
      ElMessage.error(errorMessage)
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 获取社团列表（根据权限）
const fetchClubs = async (): Promise<void> => {
  try {
    let response
    if (isAdmin) {
      response = await getClubList()
      clubs.value = response.data.clubs || []
    } else if (isPresident) {
      response = await getOwnedClubs()
      clubs.value = response.data.owned_clubs || []
    }

    // 默认选中第一个社团
    if (clubs.value.length > 0) {
      selectedClub.value = clubs.value[0].club_id
      fetchMembers()
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || '获取社团列表失败，请稍后重试！'
      ElMessage.error(errorMessage)
    } else {
      ElMessage.error('未知错误，请稍后重试！')
    }
  }
}

// 页面初始化
onMounted(() => {
  if (isAdmin || isPresident) {
    fetchClubs()
  } else {
    ElMessage.warning('您没有查看社团成员的权限。')
  }
})
</script>

<style scoped>
.club-member-container {
  padding: 20px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.club-select {
  min-width: 200px;
}

.el-card {
  padding: 20px;
}
</style>
