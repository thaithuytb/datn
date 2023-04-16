import { PrismaClient } from '@prisma/client';

export async function createNebulizer(prisma: PrismaClient) {
  await prisma.nebulizer.create({
    data: {
      value: 50.9,
      status: true,
      ip: 'nebulizer_1',
    },
  });
}
