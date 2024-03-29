import * as dayjs from 'dayjs';
const VIETNAM_ZONE = 7;
export const dayjsVps = (date?: dayjs.Dayjs) => {
  const subtract = process.env.IS_PRODUCTION ? VIETNAM_ZONE : 0;
  return dayjs(date).subtract(subtract, 'hour');
};

export const dayjsVpsTimeFromRto = (date?: dayjs.Dayjs) => {
  const add = process.env.IS_PRODUCTION ? VIETNAM_ZONE : 0;
  return dayjs(date).add(add, 'hour');
};
