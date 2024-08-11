export function isAdmin(userId: string, adminUserIds?: string[]) {
  return adminUserIds?.includes(userId);
}
