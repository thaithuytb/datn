import { DeviceTypeEnum, Garden, PrismaClient } from '@prisma/client';

export async function createDevices(prisma: PrismaClient, garden: Garden) {
  const fan_1 = await prisma.device.create({
    data: {
      status: 'old',
      ip: 'fan_1',
      type: DeviceTypeEnum.FAN,
      gardenId: garden.id,
    },
  });

  const fan_2 = await prisma.device.create({
    data: {
      status: 'new',
      ip: 'fan_2',
      type: DeviceTypeEnum.FAN,
      gardenId: garden.id,
    },
  });

  return [fan_1, fan_2];
}
