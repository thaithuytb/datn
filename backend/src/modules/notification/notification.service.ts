import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateNotificationDto,
  GetNotificationsDto,
  UpdateNotificationsOnUsersDto,
} from './dto/notification.dto';
import { NotificationRepository } from '../../repositories/notification.repository';
import { responseSuccess } from '../../common/responseSuccess';
import { AuthRepository } from '../../repositories/auth.repository';
import {
  NotificationDetail,
  NotificationDetailType,
} from './models/notification.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async getNotifications(
    dto: GetNotificationsDto,
  ): Promise<NotificationDetailType> {
    const condition: Prisma.NotificationFindManyArgs = {
      where: {
        users: {
          some: {
            userId: dto.userId,
          },
        },
      },
      include: {
        createdByUser: {
          select: {
            fullName: true,
          },
        },
        users: {
          where: {
            userId: dto.userId,
          },
          select: {
            seen: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit,
    };
    if (dto.notificationType) {
      condition.where.type = dto.notificationType;
    }

    if (dto.seen) {
      condition.where = {
        users: {
          some: {
            userId: dto.userId,
            seen: dto.seen,
          },
        },
      };
    }
    const countRecords =
      await this.notificationRepository.getCountNotifications(condition.where);
    const notifications = (await this.notificationRepository.getNotifications(
      condition,
    )) as any;

    return responseSuccess(200, {
      totalRecords: countRecords,
      notifications: notifications.map((notification) =>
        NotificationDetail.transform(notification),
      ),
    });
  }

  async createNotifications(dto: CreateNotificationDto) {
    const userIdInGarden = await this.authRepository.getUserIdsInGardensOnUsers(
      dto.gardenId,
    );

    const notification = await this.notificationRepository.createNotifications(
      CreateNotificationDto.transform({
        ...dto,
        userIdsInGarden: [1, ...userIdInGarden.map((user) => user.userId)],
      }),
    );

    return responseSuccess(201, { notification });
  }

  async updateNotificationsOnUsers(dto: UpdateNotificationsOnUsersDto) {
    const result = await this.notificationRepository.updateNotificationsOnUsers(
      dto,
    );

    if (result.count !== 1) {
      throw new HttpException(
        'Update NotificationsOnUsers error',
        HttpStatus.BAD_REQUEST,
      );
    }

    return responseSuccess(204, { status: true });
  }

  async getCountNotificationsUnread(dto: { userId: number }) {
    const condition: Prisma.NotificationFindManyArgs = {
      where: {
        users: {
          some: {
            userId: dto.userId,
            seen: false,
          },
        },
      },
    };
    const countRecords =
      await this.notificationRepository.getCountNotifications(condition.where);

    return responseSuccess(200, {
      count: countRecords,
    });
  }
}
