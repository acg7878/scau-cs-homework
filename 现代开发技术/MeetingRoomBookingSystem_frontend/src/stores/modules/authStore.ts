import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const role = ref<string>(localStorage.getItem("userRole") || "");

    const setRole = (newRole: string) => {
      role.value = newRole;
      localStorage.setItem("userRole", newRole);
    };

    const clearRole = () => {
      role.value = "";
      localStorage.removeItem("userRole");
    };

    return {
      role,
      setRole,
      clearRole,
    };
  }
);
