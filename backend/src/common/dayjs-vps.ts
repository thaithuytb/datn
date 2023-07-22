import * as dayjs from 'dayjs';
export const dayjsVps = (date: dayjs.Dayjs) => {
  const substract = process.env.IS_PRODUCTION ? 7 : 0;
  return dayjs(date).subtract(substract, 'hour');
};
