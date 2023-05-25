import { DeviceTypeEnum, Garden, PrismaClient } from '@prisma/client';

export async function createDevices(prisma: PrismaClient, garden: Garden) {
  const fan_1 = await prisma.device.create({
    data: {
      status: 'new',
      ip: 'fan_1',
      type: DeviceTypeEnum.FAN,
      gardenId: garden.id,
    },
  });

  const fan_2 = await prisma.device.create({
    data: {
      status: 'new',
      ip: 'fan_2',
      type: DeviceTypeEnum.FAN,
      gardenId: garden.id,
    },
  });

  await prisma.device.createMany({
    data: [
      {
        status: 'new',
        ip: 'humi_sensor_1',
        type: DeviceTypeEnum.HUMISENSOR,
        threshold: 70,
        gardenId: garden.id,
      },
      {
        status: 'new',
        ip: 'light_sensor_1',
        type: DeviceTypeEnum.LIGHTSENSOR,
        threshold: 700,
        gardenId: garden.id,
      },
      {
        status: 'new',
        ip: 'temp_air_sensor_1',
        threshold: 30,
        otherThreshold: 80,
        type: DeviceTypeEnum.TEMPAIRSENSOR,
        gardenId: garden.id,
      },
      {
        status: 'new',
        ip: 'lamp_sensor_1',
        type: DeviceTypeEnum.LAMP,
        gardenId: garden.id,
      },
      {
        status: 'new',
        ip: 'lamp_pump_1',
        type: DeviceTypeEnum.PUMP,
        gardenId: garden.id,
      },
      {
        status: 'new',
        ip: 'nebulizer_pump_1',
        type: DeviceTypeEnum.NEBULIZER,
        gardenId: garden.id,
      },
    ],
  });

  return [fan_1, fan_2];
}
