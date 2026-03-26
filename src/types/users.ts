import type { StatusBadgeValue } from "@/types/status";

export type UserRole = "Admin" | "Editor" | "Viewer";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: StatusBadgeValue;
  lastSeen: string;
  joinedDate: string;
  avatarSrc?: string;
}

export interface InviteFormState {
  name: string;
  email: string;
  role: UserRole;
}

export type UserRoleFilter = "All" | UserRole;
export type UserStatusFilter = "All" | StatusBadgeValue;
