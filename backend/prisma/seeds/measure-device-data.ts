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
          value:
            i > 70 ? 2000 + Math.random() * 1000 : 4000 + Math.random() * 2000,
          gardenId: garden.id,
          deviceId: deviceIdLight.id,
          createdAt: dayjs('2023-07-03')
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
          value: 45 + Math.random() * 45,
          gardenId: garden.id,
          deviceId: deviceIdHumi.id,
          createdAt: dayjs('2023-07-03')
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
          temperature: 15 + Math.random() * 30,
          humidityAir: 45 + Math.random() * 45,
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
