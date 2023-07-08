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
      coordinates: 'https://goo.gl/maps/WTV8rxztaD6sHkwMA',
    },
  });
  await prisma.garden.create({
    data: {
      name: 'Test-1',
      address: 'Thái Bình',
      width: 40,
      length: 40,
      landArea: 1600,
      hight: 20,
    },
  });
  await prisma.garden.create({
    data: {
      name: 'Test-2',
      address: 'Vĩnh Phúc',
      width: 40,
      length: 40,
      landArea: 1600,
      hight: 20,
    },
  });

  return garden;
}
