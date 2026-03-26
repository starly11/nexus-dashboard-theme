import type {
  PermissionRow,
  PresenceState,
  TeamMember,
  TeamRole,
  TeamRoleFilter,
} from "@/types/team";

export const initialTeamMembers: TeamMember[] = [
  { id: "team_1", name: "Sarah Chen", email: "sarah.c@nexushq.io", role: "Admin", statusLabel: "Active Now", presence: "active" },
  { id: "team_2", name: "Marcus Wright", email: "m.wright@nexushq.io", role: "Editor", statusLabel: "Away (12m)", presence: "away" },
  { id: "team_3", name: "Elena Rodriguez", email: "e.rod@nexushq.io", role: "Viewer", statusLabel: "Active Now", presence: "active" },
  { id: "team_4", name: "Jordan Smith", email: "j.smith@nexushq.io", role: "Editor", statusLabel: "Offline", presence: "offline" },
  { id: "team_5", name: "Aisha Rahman", email: "a.rahman@nexushq.io", role: "Admin", statusLabel: "Reviewing Billing", presence: "active" },
  { id: "team_6", name: "Leo Martins", email: "leo.martins@nexushq.io", role: "Viewer", statusLabel: "Offline", presence: "offline" },
];

export const initialPendingInvites = ["alex.m@partner.io", "finance@global.co"];

export const permissionMatrix: PermissionRow[] = [
  {
    permission: "Edit Billing",
    description: "Modify subscription plans and payment methods",
    admin: true,
    editor: false,
    viewer: false,
  },
  {
    permission: "Manage Users",
    description: "Invite, remove, and change user roles",
    admin: true,
    editor: true,
    viewer: false,
  },
  {
    permission: "Export Reports",
    description: "Download CSV, PDF, and JSON data exports",
    admin: true,
    editor: true,
    viewer: true,
  },
  {
    permission: "View Analytics",
    description: "Full access to dashboards and metrics",
    admin: true,
    editor: true,
    viewer: true,
  },
];

export const teamRoleBadgeClasses: Record<TeamRole, string> = {
  Admin: "border-primary/20 bg-primary/10 text-primary",
  Editor: "border-secondary/20 bg-secondary/10 text-secondary",
  Viewer: "border-tertiary/20 bg-tertiary/10 text-tertiary-fixed",
};

export const presenceDotClasses: Record<PresenceState, string> = {
  active: "bg-success",
  away: "bg-warning",
  offline: "bg-error",
};

export const teamRoleOptions: TeamRole[] = ["Admin", "Editor", "Viewer"];
export const teamRoleFilterOptions: TeamRoleFilter[] = ["All", ...teamRoleOptions];
