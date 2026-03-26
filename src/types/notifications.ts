export type NotificationFilter = "All" | "Unread" | "Mentions" | "System";
export type NotificationKind = "mention" | "system" | "billing";

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  kind: NotificationKind;
  read: boolean;
  icon: string;
  iconWrapperClass: string;
  iconClass: string;
  dotClass: string;
  accentClass?: string;
}

export interface NotificationFilterTab {
  id: NotificationFilter;
  icon: string;
}
