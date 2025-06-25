export interface Order {
  orderId: number
  meetingRoomName: string;
  startTime: number;
  endTime: number;
  createTime: number
  updateTime: number
  totalPrice: number;
  paymentStatus: "unpaid" | "paid" | "cancelled";
}

export interface CancelRequest {
  cancelRequestId: number
  roomName: string;
  requestTime: number; // 申请时间
  refundStatus: "pending" | "approved" | "rejected"; // 退款状态
  refundAmount: number | null; // 退款金额
  createdAt: number; // 创建时间
}

