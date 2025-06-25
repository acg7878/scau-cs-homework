<template>
  <div>
    <BookForm />
    <BookTable />
  </div>
</template>

<script lang="ts" setup>
import BookForm from "@/components/customer/MeetingRoomBook/BookForm.vue";
import BookTable from "@/components/customer/MeetingRoomBook/BookTable.vue";
import { useMeetingRoomBookStore } from "@/stores/modules/customer/meetingRoomBookStore";
import { onMounted } from "vue";

// 使用 Pinia 的 store
const meetingRoomBookStore = useMeetingRoomBookStore();

// 初始化加载设备列表
onMounted(() => {
  meetingRoomBookStore.fetchEquipmentList();
});
</script>

<style lang="scss" scoped></style>
