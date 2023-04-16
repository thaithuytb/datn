import { PrismaClient } from '@prisma/client';
import { createSample } from './sample';
import { createNebulizer } from './nebulizer';
import { createFan } from './fan';
import { createPump } from './pump';
import { createMeasureDevice } from './measure-device';

export const prismaForSeed = new PrismaClient();

export const createResources = async (prisma: PrismaClient) => {
  await createSample(prisma);
  await createNebulizer(prisma);
  await createFan(prisma);
  await createPump(prisma);
  await createMeasureDevice(prisma);
};

const seed = async () => {
  await createResources(prismaForSeed);
};

export const runSeed = async () => {
  await seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prismaForSeed.$disconnect();
    });
};

runSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaForSeed.$disconnect();
  });
