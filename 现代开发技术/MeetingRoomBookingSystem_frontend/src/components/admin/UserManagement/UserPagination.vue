<template>
  <div class="pagination-container">
    <el-pagination
      @size-change="userStore.setPageSize"
      @current-change="userStore.setCurrentPage"
      :current-page="userStore.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="userStore.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userStore.users.length"
    />
  </div>
</template>

<script lang="ts" setup>
import { useUsersStore } from "@/stores/modules/admin/userStore";

const userStore = useUsersStore();
</script>

<style scoped>
.pagination-container {
  margin-top: 20px; /* 添加顶部边距 */
  margin-right: 20px; /* 添加右侧边距 */
  display: flex;
  justify-content: flex-end; /* 使分页组件靠右对齐 */
}
</style>