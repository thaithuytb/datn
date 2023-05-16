import { IsNumber } from 'class-validator';

export class GetNotificationsDto {
  @IsNumber()
  userId: number;
}
