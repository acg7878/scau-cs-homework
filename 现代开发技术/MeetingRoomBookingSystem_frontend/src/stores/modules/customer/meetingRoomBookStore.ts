import { defineStore } from "pinia";
import { ref } from "vue";
import { getEquipmentList } from "@/api/equipment";
import type { MeetingRoomFliterData } from "@/types/meetingRoom";
import { bookMeetingRoom, getMeetingRoomByFilter } from "@/api/meetingRoom";
import { ElMessage } from "element-plus";
export const useMeetingRoomBookStore = defineStore("meetingRoomBook", () => {
  // 筛选条件
  const filterForm = ref<{
    startTime: number;
    endTime: number;
    attendees: number;
    equipments: string[]; // 明确声明为字符串数组
  }>({
    startTime: 0,
    endTime: 0,
    attendees: 1,
    equipments: [], // 初始化为空数组
  });
  // 筛选后的会议室列表
  const meetingRooms = ref<MeetingRoomFliterData[]>([]);
  const equipmentList = ref<string[]>([]);
  // 加载状态
  const isLoading = ref(false);

  const fetchEquipmentList = async () => {
    const response = await getEquipmentList();
    if (response.code === 200) {
      equipmentList.value = response.data;
    } else {
      ElMessage.error(`获取设备列表失败：${response.message}`);
    }
  };
  const filterMeetingRooms = async () => {
    meetingRooms.value = [];
    isLoading.value = true;
    try {
      const response = await getMeetingRoomByFilter({
        startTime: filterForm.value.startTime,
        endTime: filterForm.value.endTime,
        attendees: filterForm.value.attendees,
        equipment: filterForm.value.equipments,
      });
      //console.log("后端返回的数据：", response.data); // 打印返回的数据
      if (response.code === 200) {
        if (response.data.length === 0) {
          // 如果返回的数据为空数组
          ElMessage.warning("没有符合条件的会议室，请调整筛选条件！");
        } else {
          meetingRooms.value = response.data;
        }
      } else {
        ElMessage.error(`筛选会议室失败：${response.message}`);
      }
    } catch (error) {
      console.error("筛选会议室失败：", error);
      ElMessage.error("筛选会议室失败，请稍后重试！");
    } finally {
      isLoading.value = false;
    }
  };

  const bookMeetingRoomAction = async (bookingData: {
    meetingRoomName: string;
    customerName: string;
    startTime: number;
    endTime: number;
  }) => {
    try {
      const response = await bookMeetingRoom(bookingData);

      // 检查后端返回的 code
      if (response.code === 200) {
        ElMessage.success("预订成功！");
      } else {
        ElMessage.error(response.message || "预订失败！");
      }
    } catch (error) {
      console.error("预订失败：", error);
      ElMessage.error("预订失败，请稍后重试！");
    }
  };

  return {
    filterForm,
    meetingRooms,
    equipmentList,
    isLoading,
    fetchEquipmentList,
    filterMeetingRooms,
    bookMeetingRoomAction,
  };
});
