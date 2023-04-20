import { PrismaClient, Garden } from '@prisma/client';

export async function createFan(prisma: PrismaClient, garden: Garden) {
  await prisma.fan.create({
    data: {
      value: 100.5,
      status: true,
      ip: 'fan_1',
      gardenId: garden.id,
    },
  });
}
