<template>
  <div>
    <!-- 新增会议室按钮 -->
    <el-button type="primary" @click="openCreateDialog" class="mb-4 add-margin"
      >新增会议室</el-button
    >
    <el-table :data="meetingRooms" border style="width: 100%">
      <!-- 会议室名称 -->
      <el-table-column prop="roomName" label="会议室名称" align="center" />
      <!-- 会议室类型 -->
      <el-table-column prop="roomType" label="会议室类型" align="center">
        <template #default="{ row }">
          {{ roomTypeMap[row.roomType] }}
        </template>
      </el-table-column>
      <!-- 座位数 -->
      <el-table-column prop="seatCount" label="座位数" align="center" />
      <!-- 价格/小时 -->
      <el-table-column prop="pricePerHour" label="价格/小时" align="center" />
      <!-- 状态 -->
      <el-table-column prop="status" label="状态" align="center">
        <template #default="{ row }">
          <el-tag :type="statusColorMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            plain
            @click="openEditDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            plain
            @click="handleDelete(row.roomName)"
            >删除</el-button
          >
          <el-button
            type="info"
            size="small"
            plain
            @click="openDetailDialog(row)"
            >详细</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { useMeetingRoomStore } from "@/stores/modules/admin/meetingRoomStore";
import { computed, onMounted } from "vue";
import {
  statusMap,
  statusColorMap,
  roomTypeMap,
} from "@/constants/meetingRoom"; // 状态映射
import type { meetingRoom } from "@/types/meetingRoom";
import { deleteMeetingRoom } from "@/api/meetingRoom";
import { ElMessage, ElMessageBox } from "element-plus";

const meetingRoomStore = useMeetingRoomStore();
const meetingRooms = computed(() => meetingRoomStore.meetingRooms); // 获取会议室数据

// 方法
const openCreateDialog = () => {
  meetingRoomStore.createDialogVisible = true;
  meetingRoomStore.resetCreateForm();
};

const openEditDialog = (row: meetingRoom) => {
  meetingRoomStore.editDialogVisible = true;
  meetingRoomStore.resetEditForm();
  //console.log(row);
  meetingRoomStore.setEditForm(row);
};

const openDetailDialog = (row: meetingRoom) => {
  meetingRoomStore.detailForm = {
    ...row,
    equipments: row.equipments ?? [], // 如果 row.equipments 是 undefined，则赋值为空数组
  }; // 将当前行数据赋值给 detailForm
  meetingRoomStore.detailDialogVisible = true; // 显示详情对话框
};

// 删除会议室
const handleDelete = (roomName: string) => {
  ElMessageBox.confirm(
    `确定要删除会议室「${roomName}」吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      await deleteMeetingRoom(roomName);
      ElMessage.success("删除成功！");
      meetingRoomStore.fetchMeetingRooms(); // 刷新列表
    })
    .catch(() => {});
};

onMounted(() => {
  meetingRoomStore.fetchMeetingRooms(); // 初始化获取会议室列表
  meetingRoomStore.fetchEquipments();
});
</script>

<style lang="scss" scoped>
.add-margin {
  margin-bottom: 20px; /* 下方增加 20px 间距 */
  margin-top: 10px; /* 上方增加 10px 间距（可选） */
}
</style>
