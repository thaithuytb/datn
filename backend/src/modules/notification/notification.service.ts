import { Injectable } from '@nestjs/common';
import { GetNotificationsDto } from './dto/notification.dto';
import { NotificationRepository } from '../../repositories/notification.repository';
import { responseSuccess } from '../../common/responseSuccess';
import {
  NotificationDetailType,
  NotificationDetail,
} from './models/notification.model';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async getNotifications(
    dto: GetNotificationsDto,
  ): Promise<NotificationDetailType> {
    const notifications = (await this.notificationRepository.getNotifications({
      where: {
        userId: dto.userId,
      },
      include: {
        notification: true,
      },
    })) as [NotificationDetail];

    return responseSuccess(200, notifications);
  }
}
