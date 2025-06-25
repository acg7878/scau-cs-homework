<template>
  <div>
    <el-table :data="meetingRooms" border style="width: 100%">
      <el-table-column
        prop="meetingRoomName"
        label="会议室名称"
        align="center"
      />
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-tag :type="statusColorMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="
              () => {
                console.log(
                  'meetingRoomName:',
                  row.meetingRoomName,
                  'status:',
                  row.status
                );
                openDialog(row.meetingRoomName, row.status);
              }
            "
          >
            修改状态
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 引入对话框组件 -->
    <meetingRoomStatusDialog />
  </div>
</template>

<script lang="ts" setup>
import { useMeetingRoomStore } from "@/stores/modules/employee/meetingRoomStore";
import { computed, onMounted } from "vue";
import { statusMap, statusColorMap } from "@/constants/meetingRoom";
import meetingRoomStatusDialog from "@/components/employee/meetingRoomOperation/meetingRoomStatusDialog.vue";

// 使用 store
const meetingRoomStore = useMeetingRoomStore();
const meetingRooms = computed(() => meetingRoomStore.meetingRooms);
const openDialog = meetingRoomStore.openDialog; // 调用 store 中的 openDialog 方法

// 页面加载时获取会议室状态
onMounted(() => {
  meetingRoomStore.fetchMeetingRooms();
});
</script>
