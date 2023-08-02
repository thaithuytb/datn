import { NotificationType, PrismaClient } from '@prisma/client';

export async function createNotifications(prisma: PrismaClient) {
  await prisma.notification.create({
    data: {
      title: 'Thay đổi trạng thái khu vườn',
      description: 'Khu vườn vừa thay đổi trạng thái từ auto -> manual',
      createdBy: 1,
      type: NotificationType.GARDEN,
      gardenId: 1,
      users: {
        createMany: {
          data: [
            {
              userId: 1,
            },
            {
              userId: 2,
            },
            {
              userId: 3,
            },
          ],
        },
      },
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Thay đổi trạng thái khu vườn',
      description: 'Khu vườn vừa thay đổi trạng thái từ auto -> manual',
      createdBy: 1,
      type: NotificationType.GARDEN,
      gardenId: 2,
      users: {
        createMany: {
          data: [
            {
              userId: 1,
            },
            {
              userId: 3,
            },
            {
              userId: 4,
            },
          ],
        },
      },
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Thay đổi trạng thái thiết bị',
      description: 'Vừa bật quạt',
      createdBy: 1,
      type: NotificationType.DEVICE,
      gardenId: 1,
      users: {
        createMany: {
          data: [
            {
              userId: 2,
            },
            {
              userId: 1,
            },
          ],
        },
      },
    },
  });
}
