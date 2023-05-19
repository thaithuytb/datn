import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDetailType } from './models/notification.model';
import { NotificationType } from '@prisma/client';
import { OptionalNotificationTypePipe } from '../../pipes/optional-notification-type-pipe';
import { RoleAdminGuard } from '../../guards/roleAdminGuard';
import { CreateNotificationDto } from './dto/notification.dto';

@Controller('api/v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @UseGuards(RoleAdminGuard)
  @Post('/create')
  async createNotification(@Body('dto') dto: CreateNotificationDto): Promise<{ count: number}> {
    return this.notificationService.createNotification(dto);
  }

  @Get()
  async getNotifications(@Req() req: any, @Query('type', OptionalNotificationTypePipe) type: NotificationType): Promise<NotificationDetailType> {
    return this.notificationService.getNotifications({ userId: req.user.id, notificationType: type });
  }
}
