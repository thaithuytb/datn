import * as jwt from 'jsonwebtoken';
import * as dayjs from 'dayjs';

export const newTopicJWT = (topic: string) =>
  jwt.sign(
    {
      newTopic: topic,
      day: parseInt(dayjs().format('D')),
      month: parseInt(dayjs().format('M')),
      // year: parseInt(dayjs().format('YYYY')),
      hour: parseInt(dayjs().format('H')),
      minute: parseInt(dayjs().format('m')),
    },
    process.env.JWT_SECRET,
  );
