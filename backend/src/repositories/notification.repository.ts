import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Notification, NotificationsOnUsers, Prisma } from '@prisma/client';
import { CreateNotificationDto } from 'src/modules/notification/dto/notification.dto';
import { PrismaTransactional } from 'prisma/custom.prisma.type';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(
    args: Prisma.NotificationsOnUsersFindManyArgs,
  ): Promise<NotificationsOnUsers[]> {
    return this.prisma.notificationsOnUsers.findMany(args);
  }

  async createNotification(
    dto: CreateNotificationDto,
    prisma: PrismaTransactional = this.prisma,
  ) {
    return prisma.notification.create({
      data: CreateNotificationDto.transform(dto),
    });
  }

  async createNotificationsOnUsers(
    args: Prisma.NotificationsOnUsersCreateManyInput[],
    prisma: PrismaTransactional = this.prisma,
  ): Promise<{ count: number }> {
    return prisma.notificationsOnUsers.createMany({
      data: args,
    });
  }
}

export interface INotificationRepository {
  getNotifications(
    args: Prisma.NotificationsOnUsersFindManyArgs,
  ): Promise<NotificationsOnUsers[]>;
  createNotification(
    dto: CreateNotificationDto,
    prisma: PrismaTransactional,
  ): Promise<Notification>;
  createNotificationsOnUsers(
    args: Prisma.NotificationsOnUsersCreateManyInput[],
    prisma: PrismaTransactional,
  ): Promise<{ count: number }>;
}
