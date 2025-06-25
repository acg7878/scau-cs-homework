// 订单状态映射
export const ORDER_STATUS_MAP: Record<string, string> = {
  unpaid: "未支付",
  paid: "已支付",
  cancelled: "已取消",
  apply_cancel: "申请取消",
  rejected: "已拒绝" // 新增
};

// 订单状态对应的标签类型
export const ORDER_STATUS_TAG_TYPE: Record<string, string> = {
  unpaid: "warning",
  paid: "success",
  cancelled: "info",
  apply_cancel: "danger",
  rejected: "danger" // 新增
};

// 取消申请状态映射
export const CANCEL_REQUEST_STATUS_MAP: Record<string, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已拒绝"
};

// 取消申请状态对应的标签类型
export const CANCEL_REQUEST_STATUS_TAG_TYPE: Record<string, string> = {
  pending: "warning",
  approved: "success",
  rejected: "danger"
};