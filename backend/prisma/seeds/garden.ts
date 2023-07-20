import { PrismaClient } from '@prisma/client';

export async function createGarden(prisma: PrismaClient) {
  const garden = await prisma.garden.create({
    data: {
      name: 'Vườn trồng cà chua',
      address: 'Đại học Bách Khoa Hà Nội',
      width: 15,
      length: 30,
      hight: 6,
      landArea: 450,
      coordinates: 'https://goo.gl/maps/h8XCzzBn8V5sUPpn9',
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

  return garden;
}
