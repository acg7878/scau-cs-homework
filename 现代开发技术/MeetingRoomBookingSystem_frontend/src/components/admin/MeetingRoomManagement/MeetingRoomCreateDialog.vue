<template>
  <el-dialog v-model="meetingRoomStore.createDialogVisible" title="新建会议室">
    <el-form
      :model="meetingRoomStore.createForm"
      ref="createFormRef"
      :rules="meetingRoomCreateRules"
      label-width="100px"
    >
      <!-- 会议室名称 -->
      <el-form-item label="会议室名称" prop="roomName">
        <el-input v-model="meetingRoomStore.createForm.roomName" />
      </el-form-item>

      <!-- 会议室类型 -->
      <el-form-item label="会议室类型" prop="roomType">
        <el-select
          v-model="meetingRoomStore.createForm.roomType"
          placeholder="选择会议室类型"
        >
          <el-option label="教室" value="classroom" />
          <el-option label="圆桌" value="round_table" />
        </el-select>
      </el-form-item>

      <!-- 座位数 -->
      <el-form-item label="座位数" prop="seatCount">
        <el-input-number
          v-model="meetingRoomStore.createForm.seatCount"
          :min="1"
        />
      </el-form-item>

      <!-- 租赁价格 -->
      <el-form-item label="租赁价格" prop="pricePerHour">
        <el-input-number
          v-model="meetingRoomStore.createForm.pricePerHour"
          :min="0"
        />
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="会议室状态" prop="status">
        <el-select
          v-model="meetingRoomStore.createForm.status"
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
          v-model="meetingRoomStore.createForm.equipments"
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
import { meetingRoomCreateRules } from "@/utils/rules";
import { statusMap } from "@/constants/meetingRoom";
import { ElMessage } from "element-plus";
const meetingRoomStore = useMeetingRoomStore();
const createFormRef = ref();

// 方法
// 取消按钮逻辑
const cancelDialog = () => {
  meetingRoomStore.createDialogVisible = false; // 关闭对话框
};

const confirmDialog = async () => {
  createFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await meetingRoomStore.createMeetingRoomStore(); // 调用 Store 方法创建会议室

        meetingRoomStore.createDialogVisible = false; // 关闭对话框
      } catch (error) {
        //ElMessage.error(`会议室创建失败：${error}`);
      }
    } else {
      ElMessage.error("请检查表单填写是否正确！");
    }
  });
};
</script>
