import { PrismaClient, Garden, Device } from '@prisma/client';

export async function createFanDatas(
  prisma: PrismaClient,
  garden: Garden,
  devices: Device[],
) {
  const promiseList = [];
  for (let i = 1; i < 100; ++i) {
    promiseList.push(
      prisma.fanData.create({
        data: {
          value: Math.random() * 101,
          status: Math.random() > 0.5 ? true : false,
          gardenId: garden.id,
          deviceId: Math.random() > 0.5 ? devices[0].id : devices[1].id,
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
