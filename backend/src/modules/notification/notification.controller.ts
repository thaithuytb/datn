import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDetailType } from './models/notification.model';
import { NotificationType } from '@prisma/client';
import { OptionalNotificationTypePipe } from '../../pipes/optional-notification-type-pipe';
import { OptionalParseIntPipe } from '../../pipes/optional-parse-int-pipe';
import { CreateNotificationDto } from './dto/notification.dto';

@Controller('api/v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Post('/create')
  async createNotifications(
    @Body('dto') dto: CreateNotificationDto,
  ): Promise<any> {
    return this.notificationService.createNotifications(dto);
  }

  @Get()
  async getNotifications(
    @Req() req: any,
    @Query('type', OptionalNotificationTypePipe) type: NotificationType,
    @Query('seen', OptionalParseIntPipe) seen?: number,
    @Query('page', new OptionalParseIntPipe()) page?: number,
    @Query('limit', new OptionalParseIntPipe()) limit?: number,
  ): Promise<NotificationDetailType> {
    return this.notificationService.getNotifications({
      userId: req.user.id,
      notificationType: type,
      seen: seen === undefined ? undefined : seen ? true : false,
      page: page || 1,
      limit: limit || 10,
    });
  }

  @Get('/count-unread')
  async getCountNotificationsUnread(@Req() req: any): Promise<any> {
    return this.notificationService.getCountNotificationsUnread({
      userId: req.user.id,
    });
  }

  @Patch('/update')
  async updateNotificationsOnUsers(
    @Req() req: any,
    @Body('dto') dto: { notificationId: number },
  ): Promise<any> {
    return this.notificationService.updateNotificationsOnUsers({
      ...dto,
      userId: req.user.id,
    });
  }
}
