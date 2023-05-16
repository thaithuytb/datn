import { Controller, Get, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDetailType } from './models/notification.model';

@Controller('api/v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  async getNotifications(@Req() req: any): Promise<NotificationDetailType> {
    return this.notificationService.getNotifications({ userId: req.user.id });
  }
}
