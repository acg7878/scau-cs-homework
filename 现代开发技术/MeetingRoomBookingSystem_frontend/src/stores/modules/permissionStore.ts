// rc/store/modules/permissions.ts:
import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import type { Router, RouteRecordRaw } from "vue-router";
import { useUserStore } from "./authStore";

declare module "vue-router" {
  interface RouteMeta {
    roles?: string[];
    title?: string;
  }
}

interface IPermissionStore {
  authRoutes: RouteRecordRaw[];
  hasRoutes: boolean;
}

export const usePermissionStore = defineStore(
  "permission",
  () => {
    const store: IPermissionStore = reactive({
      authRoutes: [],
      hasRoutes: false,
    });

    const setAuthRoutes = (routes: RouteRecordRaw[]) => {
      store.authRoutes = routes;
      store.hasRoutes = true;
    };

    const filterAuthRoutes = (routes: RouteRecordRaw[], role: string) => {
      return routes.filter((route) => {
        // 如果路由没有设置roles，则默认允许访问
        if (!route.meta?.roles) return true;
        // 检查用户角色是否在路由允许的角色列表中
        return route.meta.roles.includes(role);
      });
    };

    const addRoutesToRouter = (router: Router, routes: RouteRecordRaw[]) => {
      routes.forEach((route) => {
        if (route.name && !router.hasRoute(route.name)) {
          router.addRoute("index", route);
          console.log("添加路由:", route);
        } else if (!route.name) {
          console.warn("路由缺少 name 属性，无法添加:", route);
        }
      });
    };

    const resetAuthRoutes = () => {
      console.log("清除路由");
      store.authRoutes = [];
      store.hasRoutes = false;
    };

    const initializeDynamicRoutes = (
      router: Router,
      dynamicRoutes: RouteRecordRaw[]
    ) => {
      const userStore = useUserStore(); // 获取用户信息
      const role = userStore.role; // 获取当前用户角色

      console.log("当前用户角色:", role);

      // 根据角色过滤路由
      const accessedRoutes = filterAuthRoutes(dynamicRoutes, role);
      console.log("过滤后的路由:", accessedRoutes);

      // 设置过滤后的路由到状态管理
      setAuthRoutes(accessedRoutes);

      // 将过滤后的路由添加到 Vue Router
      addRoutesToRouter(router, accessedRoutes);
    };

    return {
      ...toRefs(store),
      setAuthRoutes,
      filterAuthRoutes,
      resetAuthRoutes,
      addRoutesToRouter,
      initializeDynamicRoutes,
    };
  }
);
