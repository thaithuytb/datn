import { Garden, Prisma, PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

export async function 
createUsers(prisma: PrismaClient, garden: Garden) {
  const hashPW = await argon2.hash("admin");

  await prisma.user.create({
    data: {
      name: 'admin',
      phoneNumber: '0337076651',
      email: 'admin@admin.com',
      password: hashPW,
      role: Role.ADMIN
    }
  });
  await prisma.user.create({
    data: {
      name: 'thai',
      phoneNumber: '0384560432',
      email: 'ngoquangthai29112001@gmail.com',
      password: hashPW,
      role: Role.USER,
      gardens: {
        create: {
          gardenId: garden.id
      }
    } as Prisma.GardensOnUsersCreateNestedManyWithoutUserInput
    }
  });
}
