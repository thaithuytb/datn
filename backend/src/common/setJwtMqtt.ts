import * as jwt from 'jsonwebtoken';
import { dayjsVps } from './dayjs-vps';

export const newTopicJWT = (topic: string) =>
  jwt.sign(
    {
      newTopic: topic,
      day: parseInt(dayjsVps().format('D')),
      month: parseInt(dayjsVps().format('M')),
      // year: parseInt(dayjs().format('YYYY')),
      hour: parseInt(dayjsVps().format('H')),
      minute: parseInt(dayjsVps().format('m')),
    },
    process.env.JWT_SECRET,
  );
