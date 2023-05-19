import { NotificationType, Prisma } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetNotificationsDto {
  @IsNumber()
  userId: number;
  @IsOptional()
  @IsEnum(NotificationType)
  notificationType?: NotificationType
}

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  gardenId?: number

  @IsEnum(NotificationType)
  type: NotificationType  
  
  static transform(dto: CreateNotificationDto): Prisma.NotificationCreateInput {
    return {
      title: dto.title,
      description:dto.description
    }
  }
}