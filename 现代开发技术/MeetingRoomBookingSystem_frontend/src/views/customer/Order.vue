<template>
  <OrderTable />
</template>

<script setup lang="ts">
import OrderTable from "@/components/customer/Order/OrderTable.vue";
import { useOrderStore } from "@/stores/modules/customer/orderStore";
import { onMounted } from "vue";
const orderStore = useOrderStore();

onMounted(() => {
  orderStore.getMyOrderList();
});
</script>
