export type TeamRole = "Admin" | "Editor" | "Viewer";
export type PresenceState = "active" | "away" | "offline";
export type TeamRoleFilter = "All" | TeamRole;

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  statusLabel: string;
  presence: PresenceState;
  avatarSrc?: string;
}

export interface InviteState {
  email: string;
  role: TeamRole;
}

export interface PermissionRow {
  permission: string;
  description: string;
  admin: boolean;
  editor: boolean;
  viewer: boolean;
}
