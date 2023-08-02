import { PrismaClient } from '@prisma/client';
import { createSample } from './sample';
import { createGarden } from './garden';
import { createUsers } from './user';
import { createDevices } from './device';
import { createNotifications } from './notification';
import { createMeasureDeviceData } from './measure-device-data';
import { createActuatorsDatas } from './actuators-data';
import { createThresholds } from './threshold';

export const prismaForSeed = new PrismaClient();

export const createResources = async (prisma: PrismaClient) => {
  await createSample(prisma);
  const garden = await createGarden(prisma);
  await createThresholds(prisma, garden);
  await createUsers(prisma, garden);
  const devices = await createDevices(prisma, garden);
  await createActuatorsDatas(prisma, garden, devices);
  await createNotifications(prisma);
  await createMeasureDeviceData(prisma, garden);
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
