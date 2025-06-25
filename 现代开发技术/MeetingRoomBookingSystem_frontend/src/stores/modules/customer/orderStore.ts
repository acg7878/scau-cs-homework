import { defineStore } from "pinia";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { Order } from "@/types/order";
import { applyCancelMyOrder, getMyOrders, payMyOrder } from "@/api/order";
import { getUserName } from "@/api/user";

export const useOrderStore = defineStore("orderStore", () => {
  const orders = ref<Order[]>();

  // 获取我的订单列表
  const getMyOrderList = async () => {
    try {
      const username = getUserName();
      if (username == null) {
        ElMessage.error("用户异常，无法获取用户名")
        return;
      };
      const response = await getMyOrders(username);
      if (response.code === 200) {
        orders.value = response.data; // 直接赋值后端返回的数据
      } else {
        ElMessage.error(`获取订单列表失败：${response.message}`);
      }
    } catch (error) {
      console.error("获取订单列表失败：", error);
      ElMessage.error("获取订单列表失败，请稍后重试！");
    }
  };

  // 取消订单
  const cancelOrder = async (orderId: number) => {
    try {
      const response = await applyCancelMyOrder(orderId);
      if (response.code === 200) {
        ElMessage.success("申请订单取消成功！具体退款请前往退款申请页面查看");
        // 更新订单列表
        await getMyOrderList();
      } else {
        ElMessage.error(`取消订单失败：${response.message}`);
      }
    } catch (error) {
      console.error("取消订单失败：", error);
      ElMessage.error("取消订单失败，请稍后重试！");
    }
  };

  // 支付订单
  const payOrder = async (orderId: number) => {
    try {
      const response = await payMyOrder(orderId);
      if (response.code === 200) {
        ElMessage.success("订单支付成功！");
        // 更新订单列表
        await getMyOrderList();
      } else {
        ElMessage.error(`支付订单失败：${response.message}`);
      }
    } catch (error) {
      console.error("支付订单失败：", error);
      ElMessage.error("支付订单失败，请稍后重试！");
    }
  };

  return {
    orders,
    getMyOrderList,
    cancelOrder,
    payOrder,
  };
});
