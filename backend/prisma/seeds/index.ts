import { PrismaClient } from '@prisma/client';
import { createSample } from './sample';
import { createNebulizer } from './nebulizer';
import { createFan } from './fan';
import { createPump } from './pump';
import { createMeasureDevice } from './measure-device';
import { createGarden } from './garden';
import { createlamb } from './lamp';
import { createUsers } from './user';

export const prismaForSeed = new PrismaClient();

export const createResources = async (prisma: PrismaClient) => {
  await createSample(prisma);
  await createUsers(prisma);
  const garden = await createGarden(prisma);
  await createNebulizer(prisma, garden);
  await createFan(prisma, garden);
  await createPump(prisma, garden);
  await createMeasureDevice(prisma, garden);
  await createlamb(prisma, garden);
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
