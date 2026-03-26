export interface ActivityRecord {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconWrapperClass: string;
  iconClass: string;
}

export interface LinkedAccount {
  id: string;
  name: string;
  connected: boolean;
}

export interface SessionRecord {
  id: string;
  device: string;
  detail: string;
  active: boolean;
  icon: string;
}

export interface ProfileDetailItem {
  icon: string;
  label: string;
  value: string;
}

export interface ProfilePreferenceCard {
  label: string;
  value: string;
  icon: string;
}
