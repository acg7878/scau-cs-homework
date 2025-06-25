<template>
  <div>
    <MeetingRoomTable />
    <MeetingRoomCreateDialog />
    <MeetingRoomEditDialog />
    <MeetingRoomDetailDialog />
  </div>
</template>

<script lang="ts" setup>
import MeetingRoomTable from "@/components/admin/MeetingRoomManagement/MeetingRoomTable.vue";
import MeetingRoomCreateDialog from "@/components/admin/MeetingRoomManagement/MeetingRoomCreateDialog.vue";
import MeetingRoomEditDialog from "@/components/admin/MeetingRoomManagement/MeetingRoomEditDialog.vue";
import MeetingRoomDetailDialog from "@/components/admin/MeetingRoomManagement/MeetingRoomDetailDialog.vue";
</script>
