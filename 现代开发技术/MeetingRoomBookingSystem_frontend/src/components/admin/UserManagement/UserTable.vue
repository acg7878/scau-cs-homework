<template>
  <el-table :data="userStore.users" border style="width: 100%">
    <el-table-column prop="username" label="用户名" align="center" />
    <el-table-column prop="email" label="邮箱" align="center" />
    <el-table-column label="创建时间" align="center">
      <template #default="{ row }">
        {{ formatTimestamp(row.createdAt) }}
      </template>
    </el-table-column>
    <el-table-column label="最近更新时间" align="center">
      <template #default="{ row }">
        {{ formatTimestamp(row.updatedAt) }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" align="center">
      <template #default="{ row }">
        <el-tag :type="userStatusColorMap[row.status]" disable-transitions>
          {{ userStatusMap[row.status] || row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <el-button type="primary" size="small" plain @click="userStore.openEditDialog(row)">编辑</el-button>
        <el-button type="danger" size="small" plain @click="handleDelete(row.username)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { useUsersStore } from "@/stores/modules/admin/userStore";
import { userStatusMap, userStatusColorMap } from "@/constants/user";
import { formatTimestamp } from "@/utils/time";
import { deleteUser } from "@/api/user";
import { ElMessageBox, ElMessage } from "element-plus";

const userStore = useUsersStore();

const handleDelete = (username: string) => {
  ElMessageBox.confirm(
    `确定要删除用户「${username}」吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      console.log(username)
      await deleteUser(username);
      ElMessage.success("删除成功！");
      userStore.fetchUsers(); // 刷新用户列表
    })
    .catch(() => {});
};
</script>
