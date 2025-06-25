<template>
  <el-dialog
    title="用户详情"
    v-model="userStore.isEditDialogVisible"
    width="30%"
  >
    <el-form :model="userStore.selectedUser" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="userStore.selectedUser.username" disabled />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userStore.selectedUser.email" disabled />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input :value="formatTimestamp(userStore.selectedUser.createdAt)" disabled />
      </el-form-item>
      <el-form-item label="最近更新时间">
        <el-input :value="formatTimestamp(userStore.selectedUser.updatedAt)" disabled />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="userStore.selectedUser.status" placeholder="请选择状态">
          <el-option
            v-for="(label, value) in userStatusMap"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="userStore.closeEditDialog">取消</el-button>
      <el-button type="primary" @click="saveStatus">保存状态</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useUsersStore } from "@/stores/modules/admin/userStore";
import { userStatusMap } from "@/constants/user";
import { formatTimestamp } from "@/utils/time"; 
import { ElMessage } from "element-plus";

const userStore = useUsersStore();

const saveStatus = async () => {
  try {
    if (userStore.selectedUser) {
      await userStore.updateUserStatusInStore(
        userStore.selectedUser.username,
        userStore.selectedUser.status
      );
      userStore.closeEditDialog(); // 关闭对话框
      userStore.fetchUsers(); // 刷新用户列表
    }
  } catch (error) {
    ElMessage.error("更新失败，请稍后重试！");
  }
};
</script>