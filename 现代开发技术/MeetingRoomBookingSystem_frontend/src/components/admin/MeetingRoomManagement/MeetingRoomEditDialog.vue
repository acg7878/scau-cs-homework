<template>
  <el-dialog v-model="meetingRoomStore.editDialogVisible" title="修改会议室">
    <el-form
      :model="meetingRoomStore.editForm"
      ref="editFormRef"
      :rules="meetingRoomEditRules"
      label-width="100px"
    >
      <!-- 原会议室名称（禁用输入框） -->
      <el-form-item label="原名称">
        <el-input v-model="meetingRoomStore.editForm.oldRoomName" disabled />
      </el-form-item>

      <!-- 新会议室名称 -->
      <el-form-item label="新名称" prop="newRoomName">
        <el-input v-model="meetingRoomStore.editForm.newRoomName" />
      </el-form-item>

      <!-- 会议室类型 -->
      <el-form-item label="会议室类型" prop="roomType">
        <el-select
          v-model="meetingRoomStore.editForm.roomType"
          placeholder="选择会议室类型"
        >
          <el-option label="教室" value="classroom" />
          <el-option label="圆桌" value="round_table" />
        </el-select>
      </el-form-item>

      <!-- 座位数 -->
      <el-form-item label="座位数" prop="seatCount">
        <el-input-number
          v-model="meetingRoomStore.editForm.seatCount"
          :min="1"
        />
      </el-form-item>

      <!-- 租赁价格 -->
      <el-form-item label="租赁价格" prop="pricePerHour">
        <el-input-number
          v-model="meetingRoomStore.editForm.pricePerHour"
          :min="0"
        />
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="会议室状态" prop="status">
        <el-select
          v-model="meetingRoomStore.editForm.status"
          placeholder="选择会议室状态"
        >
          <el-option
            v-for="(label, value) in statusMap"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>

      <!-- 设备 -->
      <el-form-item label="设备" prop="equipments">
        <el-select
          v-model="meetingRoomStore.editForm.equipments"
          placeholder="请选择设备"
          multiple
          collapse-tags
        >
          <el-option
            v-for="equipment in meetingRoomStore.equipments"
            :key="equipment"
            :label="equipment"
            :value="equipment"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="confirmDialog">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMeetingRoomStore } from "@/stores/modules/admin/meetingRoomStore";
import { ref } from "vue";
import { meetingRoomEditRules } from "@/utils/rules";
import { statusMap } from "@/constants/meetingRoom";
import { ElMessage } from "element-plus";

const meetingRoomStore = useMeetingRoomStore();
const editFormRef = ref();

// 表单验证规则


// 取消按钮逻辑
const cancelDialog = () => {
  meetingRoomStore.editDialogVisible = false; // 关闭对话框
};

// 确认按钮逻辑
const confirmDialog = async () => {
  editFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await meetingRoomStore.updateMeetingRoomStore(); // 调用 Store 方法更新会议室
        meetingRoomStore.editDialogVisible = false; // 关闭对话框
      } catch (error) {
      }
    } else {
      ElMessage.error("请检查表单填写是否正确！");
    }
  });
};
</script>