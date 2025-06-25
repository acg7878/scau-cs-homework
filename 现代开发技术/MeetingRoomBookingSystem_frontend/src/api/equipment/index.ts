import axios from "axios";
import type { ResponseData } from "@/api/meetingRoom_old/index.types";

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

// 获取设备列表接口
export const getEquipmentList = () =>
  handleRequest<string[]>(axios.get("/equipment/list"));


