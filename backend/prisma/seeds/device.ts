import { DeviceTypeEnum, Garden, PrismaClient } from '@prisma/client';

export async function createDevices(prisma: PrismaClient, garden: Garden) {
  const fan_1_1 = await prisma.device.create({
    data: {
      ip: 'fan_1_1',
      type: DeviceTypeEnum.FAN,
      gardenId: garden.id,
      startAt: '00:00:00',
      endAt: '23:59:59',
      duration: '[900]',
      time: "['05:00:00']",
    },
  });
  const lamp_1_1 = await prisma.device.create({
    data: {
      ip: 'lamp_1_1',
      type: DeviceTypeEnum.LAMP,
      gardenId: garden.id,
      startAt: '07:00:00',
      endAt: '18:59:59',
    },
  });
  const pump_1_1 = await prisma.device.create({
    data: {
      ip: 'pump_1_1',
      type: DeviceTypeEnum.PUMP,
      gardenId: garden.id,
      startAt: '00:00:00',
      endAt: '23:59:59',
      duration: '[600, 600]',
      time: "['05:30:00', '18:00:00']",
    },
  });

  await prisma.device.createMany({
    data: [
      {
        ip: 'humi_sensor_1_1',
        type: DeviceTypeEnum.HUMIDITY_SENSOR,
        gardenId: garden.id,
        startAt: '00:00:00',
        endAt: '23:59:59',
      },
      {
        ip: 'light_sensor_1_1',
        type: DeviceTypeEnum.LIGHT_SENSOR,
        gardenId: garden.id,
        startAt: '00:00:00',
        endAt: '23:59:59',
      },
      {
        ip: 'temp_air_sensor_1_1',
        type: DeviceTypeEnum.TEMPERATURE_HUMIDITY_AIR_SENSOR,
        gardenId: garden.id,
        startAt: '00:00:00',
        endAt: '23:59:59',
      },
    ],
  });

  return [fan_1_1, pump_1_1, lamp_1_1];
}
