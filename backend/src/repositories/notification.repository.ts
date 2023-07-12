import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Notification, Prisma } from '@prisma/client';
import { PrismaTransactional } from 'prisma/custom.prisma.type';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(
    arg: Prisma.NotificationFindManyArgs,
  ): Promise<Notification[]> {
    return this.prisma.notification.findMany(arg);
  }

  async getCountNotifications(
    arg: Prisma.NotificationWhereInput,
  ): Promise<number> {
    return this.prisma.notification.count({
      where: arg,
    });
  }

  async updateNotificationsOnUsers(dto: {
    userId: number;
    notificationId: number;
  }): Promise<{ count: number }> {
    return this.prisma.notificationsOnUsers.updateMany({
      where: {
        userId: dto.userId,
        notificationId: dto.notificationId,
      },
      data: {
        seen: true,
      },
    });
  }
  async createNotifications(
    arg: Prisma.NotificationCreateInput,
    prisma: PrismaTransactional = this.prisma,
  ): Promise<Notification> {
    return prisma.notification.create({
      data: arg,
    });
  }
}

export interface INotificationRepository {
  getNotifications(
    args: Prisma.NotificationFindManyArgs,
  ): Promise<Notification[]>;
  // createNotification(
  //   dto: CreateNotificationDto,
  //   prisma: PrismaTransactional,
  // ): Promise<Notification>;
  // createNotificationsOnUsers(
  //   args: Prisma.NotificationsOnUsersCreateManyInput[],
  //   prisma: PrismaTransactional,
  // ): Promise<{ count: number }>;
}
