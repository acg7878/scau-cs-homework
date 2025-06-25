import axios, { AxiosError, type AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import router, { dynamicRoutes } from "@/router";
import { useUserStore } from "@/stores/modules/authStore";

import { usePermissionStore } from "@/stores/modules/permissionStore";

const authItemName = "authorize";
// 设置后端基础地址
const BASE_URL = "http://localhost:8080";
axios.defaults.baseURL = BASE_URL;

const accessHeader = (): Record<string, string> => ({
  Authorization: `Bearer ${takeAccessToken()}`,
});

const defaultError = (error: AxiosError): void => {
  console.error(error);
  const status = error.response?.status;
  if (status === 429) {
    ElMessage.error(error.response?.data || "请求过于频繁，请稍后再试");
  } else {
    ElMessage.error("发生了一些错误，请联系管理员");
  }
};

const defaultFailure = (
  message: string,
  status?: number,
  url?: string
): void => {
  console.warn(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
  ElMessage.error(message);
};

const takeAccessToken = (): string | null => {
  const str =
    localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);
  if (!str) return null;
  const authObj = JSON.parse(str);
  if (new Date(authObj.expire) <= new Date()) {
    deleteAccessToken();
    ElMessage.warning("登录状态已过期，请重新登录！");
    return null;
  }
  return authObj.token;
};

const storeAccessToken = (
  remember: boolean,
  token: string,
  expire: string
): void => {
  const authObj = {
    token: token,
    expire: expire,
  };
  const str = JSON.stringify(authObj);
  if (remember) localStorage.setItem(authItemName, str);
  else sessionStorage.setItem(authItemName, str);
};

const deleteAccessToken = (redirect = false): void => {
  localStorage.removeItem(authItemName);
  sessionStorage.removeItem(authItemName);
  if (redirect) {
    router.push({ name: "welcome-login" });
  }
};

const internalPost = <T>(
  url: string,
  data: any,
  headers: Record<string, string>,
  success: (data: T) => void,
  failure: (
    message: string,
    code?: number,
    url?: string
  ) => void = defaultFailure,
  error: (err: AxiosError) => void = defaultError
): void => {
  axios
    .post(url, data, { headers: headers })
    .then(
      ({ data }: AxiosResponse<{ code: number; message: string; data: T }>) => {
        if (data.code === 200) {
          success(data.data);
        } else if (data.code === 401) {
          failure("账号或密码错误！");
          deleteAccessToken(true);
        } else {
          failure(data.message, data.code, url);
        }
      }
    )
    .catch((err: AxiosError) => error(err));
};

const internalGet = <T>(
  url: string,
  headers: Record<string, string>,
  success: (data: T) => void,
  failure: (
    message: string,
    code?: number,
    url?: string
  ) => void = defaultFailure,
  error: (err: AxiosError) => void = defaultError
): void => {
  axios
    .get(url, { headers: headers })
    .then(
      ({ data }: AxiosResponse<{ code: number; message: string; data: T }>) => {
        if (data.code === 200) {
          success(data.data);
        } else if (data.code === 401) {
          failure("账号或密码错误！");
          deleteAccessToken(true);
        } else {
          failure(data.message, data.code, url);
        }
      }
    )
    .catch((err: AxiosError) => error(err));
};

const login = (
  username: string,
  password: string,
  remember: boolean,
  success: (data: {
    username: string;
    token: string;
    expire: string;
    role: string;
    status: string;
  }) => void,
  failure: (
    message: string,
    code?: number,
    url?: string
  ) => void = defaultFailure
): void => {
  internalPost<{
    username: string;
    token: string;
    expire: string;
    role: string;
    status: string;
  }>(
    "/api/auth/login",
    { username, password },
    { "Content-Type": "application/x-www-form-urlencoded" },
    (data) => {
      if (data.status === "pending") {
        ElMessage.warning("您的账户尚未激活，请联系管理员！");
        return;
      } else if (data.status === "frozen") {
        ElMessage.warning("您的账户已被冻结，请联系管理员！");
        return;
      }
      storeAccessToken(remember, data.token, data.expire);
      const userStore = useUserStore();
      userStore.setRole(data.role);
      const permissionStore = usePermissionStore();
      permissionStore.initializeDynamicRoutes(router, dynamicRoutes);
      ElMessage.success(`登录成功，欢迎 ${data.username}`);
      success(data);
    },
    failure
  );
};

const post = <T>(
  url: string,
  data: any,
  success: (data: T) => void,
  failure: (
    message: string,
    code?: number,
    url?: string
  ) => void = defaultFailure
): void => {
  internalPost(url, data, accessHeader(), success, failure);
};

const logout = (
  success: () => void,
  failure: (
    message: string,
    code?: number,
    url?: string
  ) => void = defaultFailure
): void => {
  get(
    "/api/auth/logout",
    () => {
      deleteAccessToken();
      const userStore = useUserStore();
      userStore.clearRole();
      const permissionStore = usePermissionStore();
      permissionStore.resetAuthRoutes();
      ElMessage.success("退出登录成功");
      success();
    },
    failure
  );
};

const get = <T>(
  url: string,
  success: (data: T) => void,
  failure: (
    message: string,
    code?: number,
    url?: string
  ) => void = defaultFailure
): void => {
  internalGet(url, accessHeader(), success, failure);
};

const unauthorized = (): boolean => !takeAccessToken();

export { post, get, login, logout, unauthorized, takeAccessToken };
