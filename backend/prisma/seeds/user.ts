import { Garden, Gender, Prisma, PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

export async function createUsers(prisma: PrismaClient, garden: Garden) {
  const hashPW = await argon2.hash('admin');

  await prisma.user.create({
    data: {
      fullName: 'admin'.toUpperCase(),
      phoneNumber: '0337076651',
      email: 'admin@admin.com',
      password: hashPW,
      role: Role.ADMIN,
      address: 'Thai Binh',
      gender: Gender.MALE,
    },
  });
  await prisma.user.create({
    data: {
      fullName: 'ngo quang thai'.toUpperCase(),
      phoneNumber: '0384560432',
      email: 'ngoquangthai@gmail.com',
      password: hashPW,
      role: Role.USER,
      address: 'Ha Noi',
      gender: Gender.MALE,
      gardens: {
        create: {
          gardenId: garden.id,
        },
      } as Prisma.GardensOnUsersCreateNestedManyWithoutUserInput,
    },
  });

  await prisma.user.create({
    data: {
      fullName: 'pham thanh hai'.toUpperCase(),
      phoneNumber: '0384560432',
      email: 'phamthanhhai@gmail.com',
      password: hashPW,
      role: Role.USER,
      address: 'Ho CHi Minh',
      gender: Gender.MALE,
      gardens: {
        create: {
          gardenId: 2,
        },
      } as Prisma.GardensOnUsersCreateNestedManyWithoutUserInput,
    },
  });
}
