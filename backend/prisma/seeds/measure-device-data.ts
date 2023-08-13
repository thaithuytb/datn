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

  for (let i = 1; i < 2000; ++i) {
    promiseList.push(
      prisma.lightLuxData.create({
        data: {
          value: i > 1000 ? 700 + Math.random() * 20 : 300 + Math.random() * 50,
          gardenId: garden.id,
          deviceId: deviceIdLight.id,
          createdAt: dayjs('2023-08-12')
            .add(i * 40, 's')
            .toISOString(),
        },
      }),
    );
  }

  for (let i = 1; i < 2000; ++i) {
    let data = 40;
    if (i < 10) {
      data = 40;
    }
    data = 30 + i;
    if (data > 80) {
      data = 50 + Math.random() * 30;
    }
    promiseList.push(
      prisma.humidityData.create({
        data: {
          value: data,
          gardenId: garden.id,
          deviceId: deviceIdHumi.id,
          createdAt: dayjs('2023-08-12')
            .add(i * 40, 's')
            .toISOString(),
        },
      }),
    );
  }

  for (let i = 1; i < 2000; ++i) {
    promiseList.push(
      prisma.temperatureHumidityAirData.create({
        data: {
          temperature: 20 + Math.random() * 5,
          humidityAir: 50 + Math.random() * 5,
          gardenId: garden.id,
          deviceId: deviceIdTempAir.id,
          createdAt: dayjs('2023-08-12')
            .add(i * 40, 's')
            .toISOString(),
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
