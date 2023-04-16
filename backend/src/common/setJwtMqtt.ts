import * as jwt from 'jsonwebtoken';

export const newTopicJWT = (topic: string) =>
  jwt.sign(
    {
      newTopic: topic,
    },
    process.env.JWT_SECRET,
  );
