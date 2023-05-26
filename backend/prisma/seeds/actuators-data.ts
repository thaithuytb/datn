import { PrismaClient, Garden, Device } from '@prisma/client';

export async function createActuatorsDatas(
  prisma: PrismaClient,
  garden: Garden,
  devices: Device[],
) {
  const promiseList = [];
  for (let i = 1; i < 100; ++i) {
    promiseList.push(
      prisma.fanData.create({
        data: {
          status: Math.random() > 0.5 ? true : false,
          gardenId: garden.id,
          deviceId: Math.random() > 0.5 ? devices[0].id : devices[1].id,
        },
      }),
    );
  }

  for (let i = 1; i < 2; ++i) {
    promiseList.push(
      prisma.pumpData.create({
        data: {
          status: Math.random() > 0.5 ? true : false,
          gardenId: garden.id,
          deviceId: devices[0].id,
        },
      }),
    );
  }

  for (let i = 1; i < 2; ++i) {
    promiseList.push(
      prisma.nebulizerData.create({
        data: {
          status: Math.random() > 0.5 ? true : false,
          gardenId: garden.id,
          deviceId: devices[0].id,
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
