import { Garden, PrismaClient } from '@prisma/client';

export async function createlamb(prisma: PrismaClient, garden: Garden) {
  await prisma.lamp.create({
    data: {
      status: true,
      ip: 'lamb_1',
      gardenId: garden.id,
    },
  });
}
