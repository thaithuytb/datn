import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async createUser(args: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: args,
    });
  }
}

export interface IAuthRepository {
  getUserByEmail(email: string): Promise<User>;
  createUser(args: Prisma.UserCreateInput): Promise<User>;
}
