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

  for (let i = 1; i < 200; ++i) {
    promiseList.push(
      prisma.lightLuxData.create({
        data: {
          value: 200 + Math.random() * 50,
          gardenId: garden.id,
          deviceId: deviceIdLight.id,
          createdAt: dayjs('2023-08-11')
            .add(i + Math.random(), 'hour')
            .toISOString(),
        },
      }),
    );
  }

  for (let i = 1; i < 300; ++i) {
    promiseList.push(
      prisma.humidityData.create({
        data: {
          value: 60 + Math.random() * 10,
          gardenId: garden.id,
          deviceId: deviceIdHumi.id,
          createdAt: dayjs('2023-08-11')
            .add(i + Math.random(), 'hour')
            .toISOString(),
        },
      }),
    );
  }

  for (let i = 1; i < 400; ++i) {
    promiseList.push(
      prisma.temperatureHumidityAirData.create({
        data: {
          temperature: 27 + Math.random() * 5,
          humidityAir: 60 + Math.random() * 6,
          gardenId: garden.id,
          deviceId: deviceIdTempAir.id,
          createdAt: dayjs('2023-08-11')
            .add(i + Math.random(), 'hour')
            .toISOString(),
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
