import { Garden, Notification, NotificationsOnUsers } from '@prisma/client';

export interface NotificationDetailType {
  statusCode: number;
  success: boolean;
  data: NotificationDetail[];
}

export interface NotificationDetail extends NotificationsOnUsers {
  notification: Notification;
}

export interface Gardens {
  gardens: Garden[] | [];
}
