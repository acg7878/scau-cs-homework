import { getMyCancelRequests } from "@/api/order";
import { getUserName } from "@/api/user";
import type { CancelRequest } from "@/types/order";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCancelOrderStore = defineStore("cancelOrder", () => {
  const cancelRequests = ref<CancelRequest[]>([]);
  const isLoading = ref(false);

  const fetchCancelRequests = async () => {
    isLoading.value = true;
    try {
        const username = getUserName();
        if(!username){
            ElMessage("似乎未登录？重新登陆一下！")
            return
        }
      const response = await getMyCancelRequests(username);
      if (response && response.code === 200) {
        cancelRequests.value = response.data;
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    cancelRequests,
    isLoading,
    fetchCancelRequests,
  };
});