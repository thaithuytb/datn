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
      address: 'Thái Bình',
      gender: Gender.MALE,
    },
  });
  await prisma.user.create({
    data: {
      fullName: 'Ngô Quang Thái'.toUpperCase(),
      phoneNumber: '0384560432',
      email: 'ngoquangthai@gmail.com',
      password: hashPW,
      role: Role.USER,
      address: 'Thái Bình',
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
      fullName: 'Nguyễn Văn A'.toUpperCase(),
      phoneNumber: '0384560431',
      email: 'ngo@gmail.com',
      password: hashPW,
      role: Role.USER,
      address: 'Thái Bình',
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
      fullName: 'Nguyễn Văn B'.toUpperCase(),
      phoneNumber: '0384560430',
      email: 'thai@gmail.com',
      password: hashPW,
      role: Role.USER,
      address: 'Thái Bình',
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
      fullName: 'Phạm Thanh Hải'.toUpperCase(),
      phoneNumber: '0384560432',
      email: 'phamthanhhai@gmail.com',
      password: hashPW,
      role: Role.USER,
      address: 'Hà Nội',
      gender: Gender.MALE,
      gardens: {
        create: {
          gardenId: 2,
        },
      } as Prisma.GardensOnUsersCreateNestedManyWithoutUserInput,
    },
  });
}
