import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { NotificationsOnUsers, Prisma } from '@prisma/client';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(
    args: Prisma.NotificationsOnUsersFindManyArgs,
  ): Promise<NotificationsOnUsers[]> {
    return this.prisma.notificationsOnUsers.findMany(args);
  }
}

export interface INotificationRepository {
  getNotifications(
    args: Prisma.NotificationsOnUsersFindManyArgs,
  ): Promise<NotificationsOnUsers[]>;
}
