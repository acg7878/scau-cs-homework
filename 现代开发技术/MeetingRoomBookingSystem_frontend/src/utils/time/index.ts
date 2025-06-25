import dayjs from "dayjs";

/**
 * 格式化时间戳为指定格式的日期字符串
 * @param timestamp 时间戳（毫秒）
 * @param format 格式化字符串，默认 "YYYY-MM-DD HH:mm:ss"
 * @returns 格式化后的日期字符串
 */
export const formatTimestamp = (timestamp: number, format = "YYYY-MM-DD HH:mm:ss"): string => {
  if (!timestamp) return "无效时间";
  return dayjs(timestamp).format(format);
};

/**
 * 获取当前时间的格式化字符串
 * @param format 格式化字符串，默认 "YYYY-MM-DD HH:mm:ss"
 * @returns 当前时间的格式化字符串
 */
export const getCurrentFormattedTime = (format = "YYYY-MM-DD HH:mm:ss"): string => {
  return dayjs().format(format);
};

