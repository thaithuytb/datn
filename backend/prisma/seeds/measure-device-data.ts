import { PrismaClient, Garden } from '@prisma/client';
import * as dayjs from 'dayjs';

export async function createMeasureDeviceData(
  prisma: PrismaClient,
  garden: Garden,
) {
  const promiseList = [];

  const deviceIdLight = await prisma.device.findFirst({
    where: {
      type: 'LIGHTSENSOR',
    },
  });

  const deviceIdHumi = await prisma.device.findFirst({
    where: {
      type: 'HUMISENSOR',
    },
  });

  const deviceIdTempAir = await prisma.device.findFirst({
    where: {
      type: 'TEMPAIRSENSOR',
    },
  });

  for (let i = 1; i < 150; ++i) {
    promiseList.push(
      prisma.lightData.create({
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
      prisma.humiData.create({
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
      prisma.tempAirData.create({
        data: {
          temp: Math.random() * 100,
          airHumidity: Math.random() * 100,
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
