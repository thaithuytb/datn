import { PrismaClient } from '@prisma/client';

export async function createFan(prisma: PrismaClient) {
  await prisma.fan.create({
    data: {
      value: 100.5,
      status: true,
      ip: 'fan_1',
    },
  });
}
