// types/notification.ts
// Shape of data from the notifications API

export type NotificationType = "Event" | "Result" | "Placement";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | "";
}