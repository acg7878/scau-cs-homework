import { createRouter, createWebHashHistory } from "vue-router";
import { unauthorized } from "@/api/auth";
import { useUserStore } from "@/stores/modules/authStore";

const staticRoutes = [
  {
    path: "/",
    name: "welcome",
    component: () => import("@/views/welcome/WelcomeView.vue"),
    children: [
      {
        path: "/",
        name: "welcome-login",
        component: () => import("@/views/welcome/LoginPage.vue"),
      },
      {
        path: "register",
        name: "welcome-register",
        component: () => import("@/views/welcome/RegisterPage.vue"),
      },
      {
        path: "forget",
        name: "welcome-forget",
        component: () => import("@/views/welcome/ForgetPage.vue"),
      },
    ],
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/views/layout/AppLayout.vue"),
    children: [
      {
        path: "", // 默认子路由，进入 /index 时显示
        name: "index-welcome",
        component: () => import("@/views/layout/Welcome.vue"),
      },
    ],
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/error/403.vue"),
    meta: { title: "403 禁止访问" },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "404 页面未找到" },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/error/500.vue"),
    meta: { title: "500 出错了！" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/404",
  },
];

export const dynamicRoutes = [
  {
    path: "/index/admin/meeting-rooms",
    name: "MeetingRoomManagement",
    meta: { title: "会议室管理", roles: ["admin"], icon: "Lock" },
    component: () => import("@/views/admin/MeetingRoomManagement.vue"),
  },
  {
    path: "/index/admin/users",
    name: "AdminUsers",
    meta: { title: "用户管理", roles: ["admin"], icon: "User" },
    component: () => import("@/views/admin/UserManagement.vue"),
  },
  {
    path: "/index/customer/meetingRoomBook",
    name: "meetingRoomBook",
    meta: { title: "会议室预订", roles: ["customer"], icon: "Clock" },
    component: () => import("@/views/customer/meetingRoomBook.vue"),
  },
  {
    path: "/index/customer/order",
    name: "CustomerOrder",
    meta: { title: "我的订单", roles: ["customer"], icon: "ShoppingTrolley" },
    component: () => import("@/views/customer/order.vue"),
  },
  {
    path: "/index/customer/apply-cancel",
    name: "CustomerApplyOrderCancel",
    meta: { title: "订单取消申请查看", roles: ["customer"], icon: "ShoppingTrolley" },
    component: () => import("@/views/customer/applyCancel.vue"),
  },
  {
    path: "/index/employee/meeting-rooms",
    name: "MeetingRoomOperation",
    meta: { title: "会议室运营", roles: ["employee"], icon: "InfoFilled" },
    component: () => import("@/views/employee/MeetingRoomOperation.vue"),
  },
  {
    path: "/index/employee/order-management",
    name: "OrderManagement",
    meta: { title: "订单管理", roles: ["employee"], icon: "ShoppingTrolley" },
    component: () => import("@/views/employee/OrderManagement.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes,
});

//setupDynamicRoutes(router, dynamicRoutes); // 动态添加路由
router.beforeEach(async (to, from, next) => {
  const isUnauthorized = unauthorized(); // 是否未登录

  // 登录/注册页访问限制
  if (to.name?.toString().startsWith("welcome") && !isUnauthorized) {
    return next("/index");
  }
  if (to.fullPath.startsWith("/index") && isUnauthorized) {
    return next("/");
  }

  if (to.meta?.roles) {
    const userStore = useUserStore();
    if (!to.meta.roles.includes(userStore.role)) {
      return next("/500"); // 跳转到 500 页面
    }
  }

  next();
});

export default router;
