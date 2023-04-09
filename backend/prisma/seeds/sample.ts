import { PrismaClient } from '@prisma/client';

export async function createSample(prisma: PrismaClient) {
  const seeds = [
    {
      name: 'Sample 1',
      status: false,
    },
    {
      name: 'Sample 2',
      status: true,
    },
  ];

  await prisma.sample.createMany({
    data: seeds,
  });
}
