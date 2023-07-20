import { Garden, Gender, PrismaClient, Role, RoleGarden } from '@prisma/client';
import * as argon2 from 'argon2';
import { uuid } from 'uuidv4';

export async function createUsers(prisma: PrismaClient, garden: Garden) {
  const promiseList = [];

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
  }),
    promiseList.push(
      prisma.user.create({
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
              role: RoleGarden.MANAGER,
            },
          },
        },
      }),
      prisma.user.create({
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
              role: RoleGarden.MANAGER,
            },
          },
        },
      }),
      prisma.user.create({
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
              role: RoleGarden.MANAGER,
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          fullName: 'Nguyễn Văn C'.toUpperCase(),
          phoneNumber: '0384560430',
          email: 'quang@gmail.com',
          password: hashPW,
          role: Role.USER,
          address: 'Thái Bình',
          gender: Gender.MALE,
          gardens: {
            create: {
              gardenId: garden.id,
              role: RoleGarden.MANAGER,
            },
          },
        },
      }),
    );

  for (let i = 0; i < 10; ++i) {
    promiseList.push(
      prisma.user.create({
        data: {
          fullName: uuid(),
          email: `user${i}@gmail.com`,
          password: hashPW,
          gardens: {
            create: {
              gardenId: 1,
              role: RoleGarden.USER,
            },
          },
        },
      }),
    );
  }

  await Promise.all(promiseList);
}
