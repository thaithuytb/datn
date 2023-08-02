import { NotificationType, Prisma } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetNotificationsDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsEnum(NotificationType)
  notificationType?: NotificationType;

  @IsOptional()
  @IsBoolean()
  seen?: boolean;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNumber()
  createdBy: number;

  @IsOptional()
  @IsArray()
  userIdsInGarden?: number[];

  @IsOptional()
  @IsNumber()
  gardenId?: number;

  static transform(dto: CreateNotificationDto): Prisma.NotificationCreateInput {
    return {
      title: dto.title,
      description: dto.description,
      gardenId: dto.gardenId,
      type: dto.type,
      createdByUser: {
        connect: {
          id: dto.createdBy,
        },
      },
      users: {
        createMany: {
          data: dto.userIdsInGarden?.map((id) => ({
            userId: id,
          })),
        },
      },
    };
  }
}

export class UpdateNotificationsOnUsersDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  notificationId: number;
}
