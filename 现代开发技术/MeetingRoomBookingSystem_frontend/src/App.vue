<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePermissionStore } from "@/stores/modules/permissionStore";
import { useUserStore } from "@/stores/modules/authStore";
import { dynamicRoutes } from "@/router";
import { onMounted } from "vue";
const router = useRouter();
const permissionStore = usePermissionStore();
const userStore = useUserStore();
onMounted(() => {
  if (userStore.role != "" && !permissionStore.hasRoutes) {
    permissionStore.initializeDynamicRoutes(router, dynamicRoutes);
  }
});
</script>

<style scoped></style>
