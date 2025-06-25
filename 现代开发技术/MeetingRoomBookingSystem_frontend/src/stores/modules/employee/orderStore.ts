import { getAllOrders, reviewCancelRequest } from "@/api/order";
import type { Order } from "@/types/order";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrderStore = defineStore("employee_order", () => {
  const orders = ref<Order[]>([]);
  const isLoading = ref(false);

  // 获取所有订单
  const fetchAllOrders = async () => {
    isLoading.value = true;
    try {
      const response = await getAllOrders();
      if (response.code === 200) {
        orders.value = response.data;
      } else {
        ElMessage.error(`获取订单失败：${response.message}`);
      }
    } catch (error) {
      console.error("获取订单失败：", error);
      ElMessage.error("获取订单失败，请稍后重试！");
    } finally {
      isLoading.value = false;
    }
  };

  // 审核取消申请
  const reviewCancel = async (orderId: number, status: string) => {
    try {
      const res = await reviewCancelRequest(orderId, status);
      if (res.code === 200) {
        ElMessage.success("审核操作成功！");
        fetchAllOrders(); // 审核后刷新订单列表
      } else {
        ElMessage.error(res.message || "审核操作失败！");
      }
    } catch (error) {
      ElMessage.error("审核操作失败，请稍后重试！");
    }
  };

  return {
    fetchAllOrders,
    orders,
    isLoading,
    reviewCancel, // 暴露审核方法
  };
});