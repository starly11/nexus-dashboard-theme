import type { StatusBadgeValue } from "@/types/status";

export interface ShowcaseRow {
  id: string;
  name: string;
  owner: string;
  status: StatusBadgeValue;
  value: string;
}
