import { PrismaClient } from '@prisma/client';

export async function createGarden(prisma: PrismaClient) {
  const garden = await prisma.garden.create({
    data: {
      name: 'Khu vườn datn',
      address: 'Đại học Bách Khoa Hà Nội',
      width: 20,
      length: 40,
      hight: 20,
      landArea: 800,
    },
  });
  await prisma.garden.create({
    data: {
      name: 'Khu vuon B',
      address: 'Thanh Xuân, Hà Nội',
      width: 40,
      length: 40,
      landArea: 1600,
      hight: 20,
    },
  });
  await prisma.garden.create({
    data: {
      name: 'Khu vuon C',
      address: 'Thanh Xuân, Hà Nội',
      width: 40,
      length: 40,
      landArea: 1600,
      hight: 20,
    },
  });

  return garden;
}
