import axios from "axios";
import { takeAccessToken } from "@/api/auth";

import type { User, ResponseData } from "@/types/user";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8080";

// 添加 Axios 请求拦截器，自动附加 Authorization 头
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

// 获取用户列表
export const getUserList = () =>
  handleRequest<User[]>(axios.get(`${BASE_URL}/user/list`));

/**
 * 更新用户状态
 * @param username 用户名
 * @param status 新的状态
 * @returns Promise<ResponseData<null>>
 */
export const updateUserStatus = (username: string, status: string) =>
  handleRequest<null>(
    axios.post(`${BASE_URL}/user/update-status`, {
      userName: username,
      status,
    })
  );

export const getUserName = (): string | null => {
  try {
    const token = takeAccessToken(); // 获取存储的 token
    if (!token) {
      console.error("Token 不存在");
      return null;
    }
    // 使用 jwtDecode 解析 token
    const decoded: { username?: string } = jwtDecode(token);
    return decoded.username || null; // 返回解析出的用户名
  } catch (error) {
    console.error("解析用户名失败：", error);
    return null;
  }
};

// 删除用户
export const deleteUser = (userName: string) =>
  handleRequest<void>(
    axios.get(`${BASE_URL}/user/delete`, {
      params: { userName }
    })
  );
