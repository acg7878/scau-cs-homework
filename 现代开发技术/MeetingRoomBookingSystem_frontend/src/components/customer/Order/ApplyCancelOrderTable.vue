<template>
  <el-table :data="cancelRequests" border style="width: 100%">
    <el-table-column prop="roomName" label="会议室" align="center" />
    <el-table-column prop="refundStatus" label="审核状态" align="center">
      <template #default="{ row }">
        <el-tag :type="CANCEL_REQUEST_STATUS_TAG_TYPE[row.refundStatus]">
          {{ CANCEL_REQUEST_STATUS_MAP[row.refundStatus] || row.refundStatus }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="refundAmount" label="退款金额" align="center" />
    <el-table-column prop="createdAt" label="创建时间" align="center">
      <template #default="{ row }">
        {{ formatTimestamp(row.createdAt) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useCancelOrderStore } from "@/stores/modules/customer/cancelOrderStore";
import { formatTimestamp } from "@/utils/time";
import { storeToRefs } from "pinia";
import { CANCEL_REQUEST_STATUS_MAP, CANCEL_REQUEST_STATUS_TAG_TYPE } from "@/constants/order";

const cancelOrderStore = useCancelOrderStore();
const { cancelRequests } = storeToRefs(cancelOrderStore);

onMounted(() => {
  cancelOrderStore.fetchCancelRequests();
});
</script>