import { createApp } from "vue";
import pinia from '@/stores'
import App from "./App.vue";
import router, { dynamicRoutes } from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "./style/index.scss"
import { usePermissionStore } from "./stores/modules/permissionStore";

const app = createApp(App);
app.use(pinia);
app.use(ElementPlus);

const permissionStore = usePermissionStore();
permissionStore.initializeDynamicRoutes(router,dynamicRoutes)

app.use(router);


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
