import { PrismaClient, Garden } from '@prisma/client';

export async function createFan(prisma: PrismaClient, garden: Garden) {
  const promiseList = [];
  for (let i = 1; i < 15; ++i) {
    promiseList.push(
      prisma.fan.create({
        data: {
          value: Math.random() * 101,
          status: Math.random() > 0.5 ? true : false,
          ip: 'fan_1',
          gardenId: garden.id,
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
