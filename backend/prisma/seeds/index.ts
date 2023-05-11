import { PrismaClient } from '@prisma/client';
import { createSample } from './sample';
import { createGarden } from './garden';
import { createUsers } from './user';
import { createDevices } from './device';
import { createFanDatas } from './fan-data';
// import { createNebulizer } from './nebulizer';
// import { createPump } from './pump';
// import { createMeasureDevice } from './measure-device';
// import { createLamb } from './lamp';

export const prismaForSeed = new PrismaClient();

export const createResources = async (prisma: PrismaClient) => {
  await createSample(prisma);
  const garden = await createGarden(prisma);
  await createUsers(prisma, garden);
  const devices = await createDevices(prisma, garden);
  await createFanDatas(prisma, garden, devices);
  // await createPump(prisma, garden);
  // await createMeasureDevice(prisma, garden);
  // await createLamb(prisma, garden);
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
