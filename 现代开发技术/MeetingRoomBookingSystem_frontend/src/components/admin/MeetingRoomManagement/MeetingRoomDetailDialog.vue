<template>
  <el-dialog v-model="meetingRoomStore.detailDialogVisible" title="会议室详情">
    <el-descriptions border :column="2" label-width="120px">
      <el-descriptions-item label="会议室名称">
        {{ meetingRoomStore.detailForm.roomName }}
      </el-descriptions-item>
      <el-descriptions-item label="会议室类型">
        {{ roomTypeMap[meetingRoomStore.detailForm.roomType] }}
      </el-descriptions-item>
      <el-descriptions-item label="座位数">
        {{ meetingRoomStore.detailForm.seatCount }}
      </el-descriptions-item>
      <el-descriptions-item label="租赁价格">
        {{ meetingRoomStore.detailForm.pricePerHour }} 元/小时
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="statusColorMap[meetingRoomStore.detailForm.status]">
          {{ statusMap[meetingRoomStore.detailForm.status] }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="设备">
        <template v-if="meetingRoomStore.detailForm.equipments.length > 0">
          <el-tag
            v-for="(equipment, index) in meetingRoomStore.detailForm.equipments"
            :key="index"
            type="info"
            effect="plain"
            class="equipment-tag"
          >
            {{ equipment }}
          </el-tag>
        </template>
        <span v-else>无</span>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="closeDetailDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useMeetingRoomStore } from "@/stores/modules/admin/meetingRoomStore";
import { statusMap, statusColorMap, roomTypeMap } from "@/constants/meetingRoom";

const meetingRoomStore = useMeetingRoomStore();

// 关闭详情对话框
const closeDetailDialog = () => {
  meetingRoomStore.detailDialogVisible = false;
};
</script>

<style scoped>
.equipment-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>