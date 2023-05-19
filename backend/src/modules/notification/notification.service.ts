import { Injectable } from '@nestjs/common';
import { CreateNotificationDto, GetNotificationsDto } from './dto/notification.dto';
import { NotificationRepository } from '../../repositories/notification.repository';
import { responseSuccess } from '../../common/responseSuccess';
import { PrismaService } from '../../infrastructures/dao/prisma.service';
import { AuthRepository } from '../../repositories/auth.repository';
import {
  NotificationDetailType,
  NotificationDetail,
} from './models/notification.model';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly prisma: PrismaService,
    private readonly authRepository: AuthRepository
  ) {}

  async getNotifications(
    dto: GetNotificationsDto,
  ): Promise<NotificationDetailType> {
    const notifications = (await this.notificationRepository.getNotifications({
      //maybe can set index userId and type to faster query
      where: {
        userId: dto.userId,
        type: dto.notificationType
      },
      include: {
        notification: true,
      },
    })) as [NotificationDetail];

    return responseSuccess(200, notifications);
  }

  async createNotification(dto: CreateNotificationDto) {
    const listUserId = await this.authRepository.getUserIdsInGardensOnUsers(dto.gardenId)
    
    return this.prisma.$transaction(async (prisma) => {
      const notification = await this.notificationRepository.createNotification(dto, prisma);
      const dataCreateNotificationsOnUsers = listUserId.map((user) => {
        return {
          userId: user.userId,
          notificationId: notification.id,
          seen: false,
          type: dto.type
        }
      })
      const createNotificationsOnUsers = await this.notificationRepository.createNotificationsOnUsers(dataCreateNotificationsOnUsers, prisma)
      return createNotificationsOnUsers
    })

  }
}
