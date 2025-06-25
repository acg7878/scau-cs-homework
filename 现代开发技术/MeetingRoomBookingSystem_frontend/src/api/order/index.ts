import axios from "axios";
import type { ResponseData } from "@/types/meetingRoom";
import type { CancelRequest, Order } from "@/types/order";
import { takeAccessToken } from "@/api/auth";

axios.interceptors.request.use((config) => {
  const token = takeAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 通用请求处理函数
const handleRequest = async <T>(
  request: Promise<any>
): Promise<ResponseData<T>> => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          code: 500,
          message: "请求失败",
          data: null,
        }
      );
    }
    throw error;
  }
};

// 获取我的订单列表
export const getMyOrders = (username: string) =>
  handleRequest<Order[]>(
    axios.get("/order/my-orders", { params: { username } })
  );

export const applyCancelMyOrder = (orderId: number) =>
  handleRequest<void>(
    axios.get("/order/apply-cancel", { params: { orderId } }) // 使用 GET 方法传递订单 ID
  );

export const payMyOrder = (orderId: number) =>
  handleRequest<void>(
    axios.get("/order/pay", { params: { orderId } }) // 使用 GET 方法传递订单 ID
  );

export const getAllOrders = () =>
  handleRequest<Order[]>(axios.get("/order/all-orders"));

// 获取取消申请列表
export const getMyCancelRequests = (username: string) =>
  handleRequest<CancelRequest[]>(
    axios.get("/order/my-cancel-request", { params: { username } })
  );

/**
 * 审核取消申请
 * @param cancelRequestId 取消申请ID
 * @param status 审核状态（"approved" 或 "rejected"）
 */
export const reviewCancelRequest = (orderId: number, status: string) =>
  handleRequest<void>(
    axios.post("/order/review-cancel-request", {
      orderId,
      status,
    })
  );
