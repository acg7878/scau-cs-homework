<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改会议室状态"
    width="30%"
    @close="onClose"
  >
    <div>
      <!-- 使用禁用的输入框展示会议室名称 -->
      <el-form>
        <el-form-item label="会议室名称">
          <el-input v-model="selectedRoomName" disabled />
        </el-form-item>
        <el-form-item label="会议室状态">
          <el-select v-model="selectedRoomStatus" placeholder="请选择状态" style="width: 100%">
            <el-option
              v-for="(label, value) in statusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMeetingRoomStore } from "@/stores/modules/employee/meetingRoomStore";
import { statusMap } from "@/constants/meetingRoom"; // 引入状态映射
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";



// 使用 store
const meetingRoomStore = useMeetingRoomStore();
const { dialogVisible,selectedRoomName, selectedRoomStatus} = storeToRefs(meetingRoomStore)


// 关闭对话框
const onClose = () => {
  meetingRoomStore.closeDialog();
};

// 确认修改状态
const onConfirm = () => {
  if (!selectedRoomStatus.value) {
    ElMessage.warning("请选择状态！");
    return;
  }
  try {
    console.log(selectedRoomName.value)
    meetingRoomStore.updateMeetingRoomStatus(selectedRoomName.value, selectedRoomStatus.value);
  } catch (error) {
    console.error("状态修改失败：", error);
  }
};
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>