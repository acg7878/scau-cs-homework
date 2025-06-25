
export interface meetingRoomShow {
  meetingRoomName: string;
  status: string;
}

export interface meetingRoom {
  roomName: string;
  pricePerHour: number;
  seatCount: number;
  status: string;
  roomType: RoomType
  equipments: string[];
}

export type RoomType = "classroom" | "round_table";

export interface meetingRoomUpdate {
  oldRoomName: string; // 原会议室名称
  newRoomName: string; // 新会议室名称
  roomType: "classroom" | "round_table"; // 会议室类型
  seatCount: number; // 座位数
  pricePerHour: number; // 每小时价格
  status: string; // 会议室状态
  equipments: string[]; // 设备列表
}

export interface MeetingRoomFliterData {
  roomName: string;
  roomType: RoomType;
  seatCount: number;
  pricePerHour: number;
  equipments: string[];
}

export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}