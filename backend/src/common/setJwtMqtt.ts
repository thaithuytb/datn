import * as jwt from 'jsonwebtoken';
import { dayjsVpsTimeFromRto } from './dayjs-vps';

export const newTopicJWT = (topic: string) =>
  jwt.sign(
    {
      newTopic: topic,
      day: parseInt(dayjsVpsTimeFromRto().format('D')),
      month: parseInt(dayjsVpsTimeFromRto().format('M')),
      // year: parseInt(dayjs().format('YYYY')),
      hour: parseInt(dayjsVpsTimeFromRto().format('H')),
      minute: parseInt(dayjsVpsTimeFromRto().format('m')),
    },
    process.env.JWT_SECRET,
  );
