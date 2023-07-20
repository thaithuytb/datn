import { Garden, PrismaClient, ThresholdNameEnum } from '@prisma/client';

export async function createThresholds(prisma: PrismaClient, garden: Garden) {
  await prisma.threshold.createMany({
    data: [
      {
        name: ThresholdNameEnum.HUMIDITY_SENSOR,
        lowThreshold: JSON.stringify([40]),
        highThreshold: JSON.stringify([80]),
        gardenId: garden.id,
      },
      {
        name: ThresholdNameEnum.LIGHT_SENSOR,
        lowThreshold: JSON.stringify([4000]),
        highThreshold: JSON.stringify([8000]),
        gardenId: garden.id,
      },
      {
        name: ThresholdNameEnum.TEMPERATURE_HUMIDITY_AIR_SENSOR,
        lowThreshold: JSON.stringify([20, 70]),
        highThreshold: JSON.stringify([30, 90]),
        gardenId: garden.id,
      },
    ],
  });
}
