<template>
  <div v-loading="isLoading" element-loading-text="加载中...">
    <el-alert
      title="标签颜色说明：灰色表示未开始，绿色表示进行中，红色表示已结束，橙色表示即将开始或结束"
      type="info"
      show-icon
      class="mb-4"
    />

    <!-- 订单表格 -->
    <el-table :data="orders" border style="width: 100%">
      <el-table-column prop="orderId" label="订单编号" align="center" />
      <el-table-column
        prop="meetingRoomName"
        label="会议室名称"
        align="center"
      />

      <!-- 开始时间 -->
      <el-table-column prop="startTime" label="开始时间" align="center">
        <template #default="{ row }">
          <el-tooltip :content="getRemainingText(row)" placement="top">
            <el-tag :type="getTagType(row)">
              {{ formatTimestamp(row.startTime) }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>

      <!-- 结束时间 -->
      <el-table-column prop="endTime" label="结束时间" align="center">
        <template #default="{ row }">
          <el-tooltip :content="getRemainingText(row)" placement="top">
            <el-tag :type="getTagType(row)">
              {{ formatTimestamp(row.endTime) }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="totalPrice" label="总价" align="center" />
      <el-table-column prop="paymentStatus" label="支付状态" align="center">
        <template #default="{ row }">
          <el-tag :type="ORDER_STATUS_TAG_TYPE[row.paymentStatus]">
            {{ ORDER_STATUS_MAP[row.paymentStatus] }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <template v-if="row.paymentStatus === 'apply_cancel'">
            <el-button
              type="success"
              size="small"
              plain
              @click="handleReview(row.orderId, 'approved')"
            >
              同意
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              @click="handleReview(row.orderId, 'rejected')"
            >
              拒绝
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { useOrderStore } from "@/stores/modules/employee/orderStore";
import { computed, onMounted, ref, onUnmounted } from "vue";
import { formatTimestamp } from "@/utils/time";
import { ORDER_STATUS_MAP, ORDER_STATUS_TAG_TYPE } from "@/constants/order";
import { ElMessageBox } from "element-plus";

// 使用 Pinia 的订单 Store
const orderStore = useOrderStore();
const orders = computed(() => orderStore.orders);
const isLoading = computed(() => orderStore.isLoading);

// 响应式的当前时间
const currentTime = ref(Date.now());

// 定时器：每秒更新一次当前时间
let timer: number | undefined;
onMounted(() => {
  orderStore.fetchAllOrders();
  timer = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000); // 每秒更新一次
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer); // 清除定时器
  }
});

// 时间间隔常量
const TEN_MINUTES = 10 * 60 * 1000;

type MeetingStatus =
  | "not_started"
  | "starting_soon"
  | "ongoing"
  | "ending_soon"
  | "ended";

// 获取会议状态
const getMeetingStatus = (row: {
  startTime: number;
  endTime: number;
}): MeetingStatus => {
  const current = currentTime.value; // 使用响应式的当前时间
  const { startTime, endTime } = row;

  if (current < startTime - TEN_MINUTES) return "not_started";
  if (current >= startTime - TEN_MINUTES && current < startTime)
    return "starting_soon";
  if (current >= startTime && current < endTime - TEN_MINUTES) return "ongoing";
  if (current >= endTime - TEN_MINUTES && current < endTime)
    return "ending_soon";
  return "ended";
};

// 获取 tag 类型
const getTagType = (row: {
  startTime: number;
  endTime: number;
}): "info" | "warning" | "success" | "danger" => {
  const status = getMeetingStatus(row);
  switch (status) {
    case "not_started":
      return "info";
    case "starting_soon":
      return "warning";
    case "ongoing":
      return "success";
    case "ending_soon":
      return "warning";
    case "ended":
      return "danger";
  }
};

// 获取剩余时间提示文本
const getRemainingText = (row: {
  startTime: number;
  endTime: number;
}): string => {
  const current = currentTime.value; // 使用响应式的当前时间
  const status = getMeetingStatus(row);

  let delta = 0;
  let action = "";

  if (status === "not_started" || status === "starting_soon") {
    delta = row.startTime - current;
    action = "开始";
  } else if (status === "ongoing" || status === "ending_soon") {
    delta = row.endTime - current;
    action = "结束";
  } else {
    return "会议已结束";
  }

  const minutes = Math.ceil(delta / 60000);
  const hours = Math.ceil(delta / (60 * 60 * 1000));
  const days = Math.ceil(delta / (24 * 60 * 60 * 1000));

  if (delta >= 24 * 60 * 60 * 1000) {
    return `距离${action}还有 ${days} 天`;
  } else if (delta >= 60 * 60 * 1000) {
    return `距离${action}还有 ${hours} 小时`;
  } else {
    return `距离${action}还有 ${minutes} 分钟`;
  }
};

// 处理审核操作
const handleReview = async (orderId: number, status: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要${status === "approved" ? "同意" : "拒绝"}该取消申请吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: status === "approved" ? "success" : "warning",
      }
    );
    // 这里调用 Pinia 的审核方法
    await orderStore.reviewCancel(orderId, status);
  } catch {
    // 用户取消操作，无需处理
  }
};
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
