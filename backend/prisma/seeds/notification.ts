import { NotificationType, PrismaClient } from '@prisma/client';

export async function createNotifications(prisma: PrismaClient) {
  await prisma.notification.create({
    data: {
      title: 'Test phan mem',
      description: 'Test phan mem',
      users: {
        createMany: {
          data: [
            {
              type: NotificationType.NOTION,
              userId: 2,
            },
            {
              type: NotificationType.NOTION,
              userId: 3,
            },
          ],
        },
      },
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Thong bao khu vuon 1',
      description: 'Test phan mem',
      users: {
        createMany: {
          data: [
            {
              type: NotificationType.CALENDAR,
              userId: 2,
            },
          ],
        },
      },
    },
  });
}
