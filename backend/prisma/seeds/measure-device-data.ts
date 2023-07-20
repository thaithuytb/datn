import { PrismaClient, Garden, ThresholdNameEnum } from '@prisma/client';
import * as dayjs from 'dayjs';

export async function createMeasureDeviceData(
  prisma: PrismaClient,
  garden: Garden,
) {
  const promiseList = [];

  const deviceIdLight = await prisma.device.findFirst({
    where: {
      type: ThresholdNameEnum.LIGHT_SENSOR,
    },
  });

  const deviceIdHumi = await prisma.device.findFirst({
    where: {
      type: ThresholdNameEnum.HUMIDITY_SENSOR,
    },
  });

  const deviceIdTempAir = await prisma.device.findFirst({
    where: {
      type: ThresholdNameEnum.TEMPERATURE_HUMIDITY_AIR_SENSOR,
    },
  });

  for (let i = 1; i < 150; ++i) {
    promiseList.push(
      prisma.lightLuxData.create({
        data: {
          value: Math.random() * 5000,
          gardenId: garden.id,
          deviceId: deviceIdLight.id,
          createdAt: dayjs('2023-07-03')
            .add(i + Math.random(), 'hour')
            .toISOString(),
        },
      }),
    );
  }

  for (let i = 1; i < 150; ++i) {
    promiseList.push(
      prisma.humidityData.create({
        data: {
          value: Math.random() * 99,
          gardenId: garden.id,
          deviceId: deviceIdHumi.id,
          createdAt: dayjs('2023-07-03')
            .add(i + Math.random(), 'hour')
            .toISOString(),
        },
      }),
    );
  }

  for (let i = 1; i < 150; ++i) {
    promiseList.push(
      prisma.temperatureHumidityAirData.create({
        data: {
          temperature: Math.random() * 100,
          humidityAir: Math.random() * 100,
          gardenId: garden.id,
          deviceId: deviceIdTempAir.id,
          createdAt: dayjs('2023-07-03')
            .add(i + Math.random(), 'hour')
            .toISOString(),
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
