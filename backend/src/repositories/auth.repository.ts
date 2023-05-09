import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(args: Prisma.UserFindFirstArgs): Promise<User> {
    return this.prisma.user.findFirst(args);
  }

  async createUser(args: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: args,
    });
  }

  async updateInformation(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(args);
  }
}

export interface IAuthRepository {
  getUserByEmail(args: Prisma.UserFindFirstArgs): Promise<User>;
  createUser(args: Prisma.UserCreateInput): Promise<User>;
  updateInformation(args: Prisma.UserUpdateArgs): Promise<User>;
}
