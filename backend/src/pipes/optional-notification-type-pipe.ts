import { BadRequestException, PipeTransform } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { isEnum } from 'class-validator';

export class OptionalNotificationTypePipe
  implements PipeTransform<string, NotificationType>
{
  transform(value: string): NotificationType | undefined {
    if (value === undefined) {
      return undefined;
    }
    if (isEnum(value, NotificationType)) {
      return NotificationType[value];
    } else {
      throw new BadRequestException(`type must be NotifycationType enum`);
    }
  }
}
