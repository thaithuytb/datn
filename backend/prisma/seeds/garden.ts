import { PrismaClient } from '@prisma/client';

export async function createGarden(prisma: PrismaClient) {
  return await prisma.garden.create({
    data: {
      name: 'garden_1',
      address: 'address_1',
      width: 20,
      length: 40,
      landArea: 800,
    },
  });
}
