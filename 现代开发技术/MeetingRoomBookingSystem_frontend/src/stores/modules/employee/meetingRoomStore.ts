import type {
  meetingRoom,
  meetingRoomShow,
} from "@/types/meetingRoom";
import { defineStore } from "pinia";
import { ref } from "vue";
import { getMeetingRoomList } from "@/api/meetingRoom"; // 引入获取会议室列表的接口
import { updateMeetingRoomStatus as apiUpdateMeetingRoomStatus } from "@/api/meetingRoom";
import { ElMessage } from "element-plus";

export const useMeetingRoomStore = defineStore("employee_Room", () => {
  const meetingRooms = ref<meetingRoomShow[]>([]); // 存储会议室名字和状态列表
  const isLoading = ref(false); // 加载状态

  // 对话框相关状态
  const dialogVisible = ref(false); // 控制对话框显示
  const selectedRoomName = ref(""); // 当前选中的会议室名称
  const selectedRoomStatus = ref(""); // 当前选中的会议室状态

  // 打开对话框
  const openDialog = (roomName: string, roomStatus: string) => {
    selectedRoomName.value = roomName;
    selectedRoomStatus.value = roomStatus;
    dialogVisible.value = true;
  };

  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false;
    selectedRoomName.value = "";
    selectedRoomStatus.value = "";
  };

  // 获取会议室状态列表
  const fetchMeetingRooms = async () => {
    isLoading.value = true;
    try {
      const response = await getMeetingRoomList();
      if (response.code === 200) {
        // 映射只需要的字段
        meetingRooms.value = response.data.map((room: meetingRoom) => ({
          meetingRoomName: room.roomName, // 映射 roomName 到 meetingRoomName
          status: room.status, // 保留 status
        }));
        
      } else {
        ElMessage.error(`获取会议室列表失败：${response.message}`);
      }
    } catch (error) {
      console.error("获取会议室列表失败：", error);
      ElMessage.error("获取会议室列表失败，请稍后重试！");
    } finally {
      isLoading.value = false;
    }
  };

  const updateMeetingRoomStatus = async (
    meetingRoomName: string,
    newStatus: string
  ) => {
    console.log(meetingRoomName,newStatus)
    try {
      // 调用接口更新状态
      const response = await apiUpdateMeetingRoomStatus(meetingRoomName, newStatus);
      // 检查后端返回的 code
      //console.error(response.code)
      if (response.code === 200) {
        // 更新本地状态
        const room = meetingRooms.value.find(
          (room) => room.meetingRoomName === meetingRoomName
        );
        if (room) {
          room.status = newStatus ; 
        }

        ElMessage.success("状态修改成功！");
        closeDialog(); // 成功后关闭对话框
      } else {
        // 如果 code 不是 200，抛出错误
        ElMessage.error(response.message);
      }
    } catch (error) {
      console.error("更新会议室状态失败：", error);
      ElMessage.error("更新会议室状态失败，请稍后重试！");
      
    }
  };

  return {
    meetingRooms,
    isLoading,
    fetchMeetingRooms,
    openDialog,
    closeDialog,
    dialogVisible,
    selectedRoomName,
    selectedRoomStatus,
    updateMeetingRoomStatus, // 导出更新状态的方法
  };
});
