// 表单验证规则
export const meetingRoomCreateRules = {
  roomName: [{ required: true, message: "请输入会议室名称", trigger: "blur" }],
  roomType: [{ required: true, message: "请选择会议室类型", trigger: "change" }],
  seatCount: [{ required: true, message: "请输入座位数", trigger: "blur" }],
  pricePerHour: [{ required: true, message: "请输入租赁价格", trigger: "blur" }],
  status: [{ required: true, message: "请选择会议室状态", trigger: "change" }],
  equipments: [
    { type: "array", required: true, message: "请选择至少一个设备", trigger: "change" },
  ],
};

export const meetingRoomEditRules = {
  newRoomName: [{ required: true, message: "请输入新会议室名称", trigger: "blur" }],
  roomType: [{ required: true, message: "请选择会议室类型", trigger: "change" }],
  seatCount: [{ required: true, message: "请输入座位数", trigger: "blur" }],
  pricePerHour: [{ required: true, message: "请输入租赁价格", trigger: "blur" }],
  status: [{ required: true, message: "请选择会议室状态", trigger: "change" }],
};