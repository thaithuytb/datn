import { PrismaClient } from '@prisma/client';

export async function createMeasureDevice(prisma: PrismaClient) {
  await prisma.light.create({
    data: {
      value: 8000.55,
      threshold: 8500,
      ip: 'light_1',
    },
  });

  await prisma.humi.create({
    data: {
      value: 65.55,
      threshold: 70,
      ip: 'humi_1',
    },
  });

  await prisma.tempAir.create({
    data: {
      temp: 25.45,
      tempThreshold: 30,
      airHumidity: 70,
      airHumidityThreshold: 80,
      ip: 'tempAir_1',
    },
  });
}
