import type { UserRecord, UserRole, UserRoleFilter, UserStatusFilter } from "@/types/users";

export const initialUsers: UserRecord[] = [
  { id: "NX-9921", name: "Elena Vance", email: "elena.vance@nexushq.io", role: "Admin", status: "active", lastSeen: "2 mins ago", joinedDate: "Jan 12, 2025" },
  { id: "NX-4021", name: "Marcus Thorne", email: "m.thorne@nexushq.io", role: "Editor", status: "active", lastSeen: "1 hour ago", joinedDate: "Feb 03, 2025" },
  { id: "NX-1120", name: "Sarah Jenkins", email: "sarah.jenkins.operations@nexushq.io", role: "Viewer", status: "inactive", lastSeen: "Oct 12, 2025", joinedDate: "Mar 19, 2025" },
  { id: "NX-5523", name: "David Chen", email: "d.chen@nexushq.io", role: "Editor", status: "active", lastSeen: "5 mins ago", joinedDate: "Apr 02, 2025" },
  { id: "NX-8842", name: "Sofia Rossi", email: "s.rossi@nexushq.io", role: "Viewer", status: "active", lastSeen: "Yesterday", joinedDate: "Apr 17, 2025" },
  { id: "NX-7719", name: "Julian Blackwood", email: "julian.blackwood@nexushq.io", role: "Admin", status: "active", lastSeen: "12 mins ago", joinedDate: "May 01, 2025" },
  { id: "NX-6618", name: "Priya Malhotra", email: "priya.malhotra@nexushq.io", role: "Editor", status: "pending", lastSeen: "Pending invite", joinedDate: "May 14, 2025" },
  { id: "NX-2301", name: "Tobias Reed", email: "tobias.reed@nexushq.io", role: "Viewer", status: "active", lastSeen: "24 mins ago", joinedDate: "Jun 08, 2025" },
  { id: "NX-4827", name: "Amara Collins", email: "amara.collins@nexushq.io", role: "Admin", status: "active", lastSeen: "Just now", joinedDate: "Jun 18, 2025" },
  { id: "NX-9044", name: "Nikolai Petrov", email: "nikolai.petrov@nexushq.io", role: "Editor", status: "error", lastSeen: "Sync error", joinedDate: "Jul 02, 2025" },
  { id: "NX-7112", name: "Lina Alvarez", email: "lina.alvarez@nexushq.io", role: "Viewer", status: "active", lastSeen: "3 hours ago", joinedDate: "Jul 27, 2025" },
  { id: "NX-5083", name: "Haruto Sakamoto", email: "haruto.sakamoto@nexushq.io", role: "Editor", status: "active", lastSeen: "48 mins ago", joinedDate: "Aug 09, 2025" },
  { id: "NX-6348", name: "Maya Ibrahim", email: "maya.ibrahim@nexushq.io", role: "Viewer", status: "pending", lastSeen: "Invite sent", joinedDate: "Aug 23, 2025" },
  { id: "NX-1907", name: "Christopher Jonathan Remington-Smythe", email: "christopher.jonathan.remington-smythe+enterprise-security@nexushq.io", role: "Admin", status: "active", lastSeen: "6 mins ago", joinedDate: "Sep 01, 2025" },
  { id: "NX-2845", name: "Yara Haddad", email: "yara.haddad@nexushq.io", role: "Editor", status: "active", lastSeen: "32 mins ago", joinedDate: "Sep 18, 2025" },
  { id: "NX-4459", name: "Noah Sinclair", email: "noah.sinclair@nexushq.io", role: "Viewer", status: "inactive", lastSeen: "Nov 02, 2025", joinedDate: "Oct 04, 2025" },
  { id: "NX-8126", name: "Aisha Rahman", email: "aisha.rahman@nexushq.io", role: "Admin", status: "active", lastSeen: "14 mins ago", joinedDate: "Oct 15, 2025" },
  { id: "NX-9551", name: "Leo Martins", email: "leo.martins@nexushq.io", role: "Viewer", status: "invited", lastSeen: "Invite pending", joinedDate: "Nov 11, 2025" },
];

export const userRoleAccents: Record<UserRole, string> = {
  Admin: "border-primary/20 bg-primary/10 text-primary",
  Editor: "border-secondary/20 bg-secondary/10 text-secondary",
  Viewer: "border-tertiary/20 bg-tertiary/10 text-tertiary-fixed",
};

export const userSkeletonRows = Array.from({ length: 10 }, (_, index) => `skeleton-${index}`);

export const userGrowthBars = [
  { id: "bar-1", height: 42 },
  { id: "bar-2", height: 56 },
  { id: "bar-3", height: 68 },
  { id: "bar-4", height: 84 },
  { id: "bar-5", height: 50 },
  { id: "bar-6", height: 38 },
  { id: "bar-7", height: 61 },
  { id: "bar-8", height: 74 },
] as const;

export const userRoleOptions: UserRole[] = ["Admin", "Editor", "Viewer"];
export const userRoleFilterOptions: UserRoleFilter[] = ["All", ...userRoleOptions];
export const userStatusFilterOptions: UserStatusFilter[] = ["All", "active", "inactive", "pending", "invited", "error"];
