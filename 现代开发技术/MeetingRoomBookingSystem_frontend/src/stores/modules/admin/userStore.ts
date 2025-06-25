import { computed, ref } from "vue";
import { getUserList, updateUserStatus } from "@/api/user";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const isEditDialogVisible = ref(false);
  const selectedUser = ref<User>({
    username: "",
    email: null,
    createdAt: 0,
    updatedAt: 0,
    status: "",
  }); // 当前选中的用户
  const currentPage = ref(1); // 当前页码
  const pageSize = ref(10); // 每页显示条数

  const fetchUsers = async () => {
    try {
      const response = await getUserList();
      if (response.code === 200) {
        users.value = response.data.map((user: User) => ({
          ...user,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
      } else {
        ElMessage.error(`获取用户列表失败：${response.message}`);
      }
    } catch (error) {
      console.error("获取用户列表失败：", error);
      ElMessage.error("获取用户列表失败，请稍后重试！");
    }
  };

  const updateUserStatusInStore = async (username: string, status: string) => {
    try {
      const response = await updateUserStatus(username, status); // 调用接口
      if (response.code === 200) {
        // 更新本地用户状态
        const user = users.value.find((u) => u.username === username);
        if (user) {
          user.status = status;
        }
        ElMessage.success("用户状态更新成功！"); // 成功提示
      } else {
        ElMessage.error(`更新用户状态失败：${response.message}`); // 错误提示
      }
    } catch (error) {
      ElMessage.error("更新用户状态失败，请稍后重试！"); // 网络错误提示
      console.error("更新用户状态失败：", error);
    }
  };

  const pagedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return users.value.slice(start, end);
  });

  // 设置当前页码
  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  // 设置每页显示条数
  const setPageSize = (size: number) => {
    pageSize.value = size;
  };

  // 打开编辑对话框
  const openEditDialog = (user: User) => {
    selectedUser.value = { ...user }; // 设置选中的用户
    isEditDialogVisible.value = true; // 显示对话框
  };

  // 关闭编辑对话框
  const closeEditDialog = () => {
    isEditDialogVisible.value = false; // 隐藏对话框
    selectedUser.value = {
      username: "",
      email: null,
      createdAt: 0,
      updatedAt: 0,
      status: "",
    }; // 清空选中的用户
  };

  return {
    users,
    currentPage,
    pageSize,
    pagedUsers,
    setCurrentPage,
    setPageSize,
    fetchUsers,
    isEditDialogVisible,
    selectedUser,
    openEditDialog,
    closeEditDialog,
    updateUserStatusInStore,
  };
});
