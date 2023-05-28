import { DeviceTypeEnum, Garden, PrismaClient } from '@prisma/client';

export async function createDevices(prisma: PrismaClient, garden: Garden) {
  const fan_1 = await prisma.device.create({
    data: {
      ip: 'fan_1_1',
      type: DeviceTypeEnum.FAN,
      gardenId: garden.id,
    },
  });

  const fan_2 = await prisma.device.create({
    data: {
      ip: 'fan_2_1',
      type: DeviceTypeEnum.FAN,
      gardenId: garden.id,
      status: false,
    },
  });

  await prisma.device.createMany({
    data: [
      {
        ip: 'humi_sensor_1_1',
        type: DeviceTypeEnum.HUMISENSOR,
        threshold: 70,
        gardenId: garden.id,
      },
      {
        ip: 'light_sensor_1_1',
        type: DeviceTypeEnum.LIGHTSENSOR,
        threshold: 700,
        gardenId: garden.id,
      },
      {
        ip: 'temp_air_sensor_1',
        threshold: 30,
        otherThreshold: 80,
        type: DeviceTypeEnum.TEMPAIRSENSOR,
        gardenId: garden.id,
      },
      {
        ip: 'lamp_1_1',
        type: DeviceTypeEnum.LAMP,
        gardenId: garden.id,
      },
      {
        ip: 'pump_1',
        type: DeviceTypeEnum.PUMP,
        gardenId: garden.id,
      },
      {
        status: false,
        ip: 'nebulizer_pump_1',
        type: DeviceTypeEnum.NEBULIZER,
        gardenId: garden.id,
      },
    ],
  });

  return [fan_1, fan_2];
}
