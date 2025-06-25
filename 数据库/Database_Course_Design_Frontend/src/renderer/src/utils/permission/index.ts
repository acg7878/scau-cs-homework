export const hasPermission = (route): boolean => {
  const userRole = localStorage.getItem('user_role') // 获取当前用户角色，提供默认值
  if (!route.meta?.roles) return true // 如果没有设置 roles，默认有权限
  return route.meta.roles.includes(userRole) // 检查用户角色是否在允许列表中
}
