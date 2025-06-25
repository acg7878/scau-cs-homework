export const statusMap = {
  available: "可用",
  locked: "锁定",
  booked: "已预定",
  in_use: "正在使用",
  under_maintenance: "维修中",
};

export const roomTypeMap = {
  classroom: "教室",
  round_table: "圆桌",
};

export const statusColorMap = {
  available: "success",
  locked: "info",
  booked: "warning",
  in_use: "primary",
  under_maintence: "danger",
};


export const meetingRoomStatus = {
  AVAILABLE: "available",
  LOCKED: "locked",
  BOOKED: "booked",
  IN_USE: "in_use",
  UNDER_MAINTENANCE: "under_maintenance"
} as const;

// 推导出联合类型
export type MeetingRoomStatus = typeof meetingRoomStatus[keyof typeof meetingRoomStatus];