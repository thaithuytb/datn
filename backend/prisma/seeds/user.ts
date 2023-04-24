import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

export async function createUsers(prisma: PrismaClient) {
  const hashPW = await argon2.hash("admin");
  const data: Prisma.UserCreateInput[] = [{
    name: 'admin',
    phoneNumber: '0337076651',
    email: 'admin@admin.com',
    password: hashPW,
    role: Role.ADMIN
  }, {
    name: 'thai',
    phoneNumber: '0384560432',
    email: 'ngoquangthai29112001@gmail.com',
    password: hashPW,
    role: Role.USER
  }

]
  await prisma.user.createMany({
    data
  });
}
