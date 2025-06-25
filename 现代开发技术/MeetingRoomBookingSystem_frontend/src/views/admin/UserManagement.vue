<template>
  <div style="width: 100%">
    <UserTable />
    <UserPagination />
    <UserEditDialog />
  </div>
</template>

<script lang="ts" setup>
import { useUsersStore } from "@/stores/modules/admin/userStore";
import UserTable from "@/components/admin/UserManagement/UserTable.vue";
import UserPagination from "@/components/admin/UserManagement/UserPagination.vue";
import UserEditDialog from "@/components/admin/UserManagement/UserEditDialog.vue"
import { onMounted } from "vue";

const userStore = useUsersStore();
onMounted(() => {
  userStore.fetchUsers();
});
</script>
