import { getEquipmentList } from "@/api/equipment";
import {
  createMeetingRoom,
  getMeetingRoomList,
  updateMeetingRoom,
} from "@/api/meetingRoom";
import type { meetingRoom, meetingRoomUpdate } from "@/types/meetingRoom";
import { meetingRoomStatus } from "@/constants/meetingRoom";
import { ElMessage, ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMeetingRoomStore = defineStore("admin_meetingRoom", () => {
  // 实体
  const meetingRooms = ref<meetingRoom[]>([]);
  const equipments = ref<string[]>([]);

  // 状态值
  const createDialogVisible = ref(false);
  const editDialogVisible = ref(false);
  const detailDialogVisible = ref(false);

  // 表单
  const createForm = ref<meetingRoom>({
    roomName: "",
    roomType: "classroom",
    seatCount: 0,
    pricePerHour: 0.0,
    status: meetingRoomStatus.AVAILABLE,
    equipments: [],
  });

  const editForm = ref<meetingRoomUpdate>({
    oldRoomName: "", // 原会议室名称
    newRoomName: "", // 新会议室名称
    roomType: "classroom", // 默认会议室类型
    seatCount: 0, // 默认座位数
    pricePerHour: 0.0, // 默认租赁价格
    status: meetingRoomStatus.AVAILABLE, // 默认状态
    equipments: [], // 默认设备列表
  });

  const detailForm = ref<meetingRoom>({
    roomName: "",
    roomType: "classroom",
    seatCount: 0,
    pricePerHour: 0.0,
    status: meetingRoomStatus.AVAILABLE,
    equipments: [],
  });

  const setEditForm = (row: meetingRoom) => {
    editForm.value = {
      oldRoomName: row.roomName,
      newRoomName: "",
      roomType: row.roomType,
      seatCount: row.seatCount,
      pricePerHour: row.pricePerHour,
      status: row.status,
      equipments: [...(row.equipments ?? [])], // 确保数组不会被共享引用
    };
  };

  const fetchEquipments = async () => {
    try {
      const response = await getEquipmentList();
      if (response.code === 200) {
        equipments.value = response.data;
      } else [ElMessage(`获取设备列表出错：${response.message}`)];
    } catch (err) {
      ElMessage("获取设备列表出错，请稍后再试");
    }
  };

  const fetchMeetingRooms = async () => {
    try {
      //console.log("fetchMeetingRooms");
      const response = await getMeetingRoomList();
      if (response.code === 200) {
        meetingRooms.value = response.data;
      } else {
        ElNotification({
          title: "错误",
          message: response.message || "获取会议室列表失败",
          type: "error",
        });
      }
    } catch (error) {
      console.error("获取会议室列表异常:", error);
      ElNotification({
        title: "错误",
        message: "网络请求异常，请检查网络连接",
        type: "error",
      });
    }
  };

  const createMeetingRoomStore = async () => {
    try {
      const response = await createMeetingRoom(createForm.value);
      if (response.code === 200) {
        ElMessage.success("会议室创建成功");
        fetchMeetingRooms();
      } else {
        ElMessage.error(`会议室创建失败：${response.message}`);
      }
    } catch (err) {
      ElMessage.error("会议室创建失败，请稍后再试");
    }
  };

  const updateMeetingRoomStore = async () => {
    try {
      const response = await updateMeetingRoom(editForm.value); // 调用接口更新会议室
      if (response.code === 200) {
        ElMessage.success("会议室更新成功");
        fetchMeetingRooms(); // 更新成功后刷新会议室列表
        editDialogVisible.value = false; // 关闭编辑对话框
      } else {
        ElMessage.error(`会议室更新失败：${response.message}`);
      }
    } catch (err) {
      ElMessage.error("会议室更新失败，请稍后再试");
    }
  };

  const resetCreateForm = () => {
    createForm.value = {
      roomName: "",
      roomType: "classroom",
      seatCount: 0,
      pricePerHour: 0.0,
      status: meetingRoomStatus.AVAILABLE,
      equipments: [],
    };
  };

  const resetEditForm = () => {
    editForm.value = {
      oldRoomName: "", // 原会议室名称
      newRoomName: "", // 新会议室名称
      roomType: "classroom", // 默认会议室类型
      seatCount: 0, // 默认座位数
      pricePerHour: 0.0, // 默认租赁价格
      status: meetingRoomStatus.AVAILABLE, // 默认状态
      equipments: [], // 默认设备列表
    };
  };

  return {
    // 方法
    fetchMeetingRooms,
    fetchEquipments,
    createMeetingRoomStore,
    resetCreateForm,
    setEditForm,
    updateMeetingRoomStore,
    // 实体
    meetingRooms,
    equipments,

    // 会议室对话框
    createDialogVisible,
    editDialogVisible,
    detailDialogVisible,
    createForm,
    editForm,
    detailForm,
    resetEditForm,
  };
});
