import { PrismaClient, Garden, Device } from '@prisma/client';

export async function createActuatorsDatas(
  prisma: PrismaClient,
  garden: Garden,
  devices: Device[],
) {
  const promiseList = [];
  for (let i = 1; i < 100; ++i) {
    promiseList.push(
      prisma.actuatorData.create({
        data: {
          status: Math.random() > 0.5 ? true : false,
          gardenId: garden.id,
          deviceId:
            Math.random() > 0.8
              ? devices[0].id
              : Math.random() > 0.4
              ? devices[1].id
              : devices[2].id,
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
