import { PrismaClient } from '@prisma/client';

export async function createGarden(prisma: PrismaClient) {
  const garden = await prisma.garden.create({
    data: {
      name: 'Vườn hoa quả',
      address: 'Thái Thụy, Thái Bình',
      width: 20,
      length: 40,
      hight: 20,
      landArea: 800,
    },
  });
  await prisma.garden.create({
    data: {
      name: 'garden_2',
      address: 'Vườn ngô',
      width: 40,
      length: 40,
      landArea: 1600,
      hight: 20,
    },
  });

  return garden;
}
