import { Garden } from '@prisma/client';

export interface NotificationDetailType {
  statusCode: number;
  success: boolean;
  data: {
    notifications: NotificationDetail[];
    totalRecords: number;
  };
}

export class NotificationDetail {
  notification: INotification;
  createdBy: {
    fullName: string;
  };
  notificationStatus: {
    seen: boolean;
  };

  static transform(data: any): NotificationDetail {
    return {
      notification: {
        id: data.id,
        description: data.description,
        title: data.title,
        createdAt: data.createdAt,
        gardenId: data.gardenId,
        type: data.type,
      },
      createdBy: data.createdByUser,
      notificationStatus: data.users[0],
    };
  }
}

export interface Gardens {
  gardens: Garden[] | [];
}

interface INotification {
  id: string;
  description: string;
  title: string;
  createdAt: string;
  gardenId: number;
  type: string;
}
