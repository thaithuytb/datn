import { PrismaClient } from '@prisma/client';

export async function createGarden(prisma: PrismaClient) {
  await prisma.garden.create({
    data: {
      name: 'garden_1',
      address: 'address_1',
      width: 20,
      length: 40,
      hight: 20,
      landArea: 800,
    },
  });
  return prisma.garden.create({
    data: {
      name: 'garden_2',
      address: 'address_2',
      width: 40,
      length: 40,
      landArea: 1600,
      hight: 20,
    },
  });
}
