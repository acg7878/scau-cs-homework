import axios from "axios";
import { handleRequest } from "@/utils/axios";
import type { meetingRoom, MeetingRoomFliterData, meetingRoomUpdate } from "@/types/meetingRoom";
import { takeAccessToken } from "@/api/auth";

axios.interceptors.request.use((config) => {
  const token = takeAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 获取会议室列表
export const getMeetingRoomList = () =>
  handleRequest<meetingRoom[]>(axios.get(`/meeting-rooms/list`));

export const updateMeetingRoomStatus = (
  meetingRoomName: string,
  status: string
) =>
  handleRequest<void>(
    axios.put(`/meeting-rooms/update-status`, {
      meetingRoomName,
      status,
    })
  );

// 创建会议室
export const createMeetingRoom = (data: meetingRoom) =>
  handleRequest<void>(axios.post(`/meeting-rooms/create`, data));

// 更新会议室
export const updateMeetingRoom = (data: meetingRoomUpdate) =>
  handleRequest<void>(axios.post(`/meeting-rooms/update`, data));

// 删除会议室
export const deleteMeetingRoom = (meetingRoomName: string) =>
  handleRequest<void>(
    axios.post("/meeting-rooms/delete", {
      meetingRoomName,
    })
  );

// 预订会议室
export const bookMeetingRoom = (bookingData: {
  meetingRoomName: string;
  customerName: string;
  startTime: number;
  endTime: number;
}) =>
  handleRequest<void>(
    axios.post("/meeting-rooms/book", {
      meetingRoomName: bookingData.meetingRoomName,
      customerName: bookingData.customerName,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
    })
  );

// 根据筛选条件获取会议室列表接口
export const getMeetingRoomByFilter = (filterCriteria: {
  startTime: number;
  endTime: number;
  attendees: number;
  equipment: string[];
}) =>
  handleRequest<MeetingRoomFliterData[]>(
    axios.post("/meeting-rooms/fliter", {
      startTime: filterCriteria.startTime,
      endTime: filterCriteria.endTime,
      attendees: filterCriteria.attendees,
      equipment: filterCriteria.equipment,
    })
  );
