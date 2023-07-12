import { Garden, PrismaClient, ThresholdNameEnum } from '@prisma/client';

export async function createThresholds(prisma: PrismaClient, garden: Garden) {
  await prisma.threshold.createMany({
    data: [
      {
        name: ThresholdNameEnum.HUMISENSOR,
        lowThreshold: JSON.stringify([60]),
        highThreshold: JSON.stringify([80]),
        gardenId: garden.id,
      },
      {
        name: ThresholdNameEnum.LIGHTSENSOR,
        lowThreshold: JSON.stringify([300]),
        highThreshold: JSON.stringify([1500]),
        gardenId: garden.id,
      },
      {
        name: ThresholdNameEnum.TEMPAIRSENSOR,
        lowThreshold: JSON.stringify([25, 70]),
        highThreshold: JSON.stringify([45, 90]),
        gardenId: garden.id,
      },
    ],
  });
}
