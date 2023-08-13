import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { GardensOnUsers, Prisma, User } from '@prisma/client';
import { UpsertGardensOnUsers } from '../modules/auth/dto/gardensOnUsers.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(arg: Prisma.UserFindFirstArgs): Promise<User> {
    return this.prisma.user.findFirst(arg);
  }

  async createUser(arg: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: arg,
    });
  }

  async updateInformation(arg: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(arg);
  }

  async getUserIdsInGardensOnUsers(
    gardenId?: number,
  ): Promise<{ userId: number }[]> {
    return this.prisma.gardensOnUsers.findMany({
      where: {
        gardenId,
      },
      select: {
        userId: true,
      },
      distinct: 'userId',
    });
  }

  async getGardensOnUsers(
    arg: Prisma.GardensOnUsersFindManyArgs,
  ): Promise<GardensOnUsers[]> {
    return this.prisma.gardensOnUsers.findMany(arg);
  }

  async getUsers(arg: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(arg);
  }

  async getCountUsersOrUsersOnGardens(gardenId?: number): Promise<number> {
    if (!gardenId) {
      return this.prisma.user.count();
    }
    return this.prisma.gardensOnUsers.count({
      where: {
        gardenId,
      },
    });
  }

  async getUsersByName(name: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        fullName: {
          contains: name ? `%${name}%` : '%',
        },
      },
      orderBy: {
        id: 'desc',
      },
      take: 7,
    });
  }

  async upsertGardenOnUser(dto: UpsertGardensOnUsers): Promise<GardensOnUsers> {
    return this.prisma.gardensOnUsers.upsert({
      where: {
        userId_gardenId: {
          userId: dto.userId,
          gardenId: dto.gardenId,
        },
      },
      create: {
        gardenId: dto.gardenId,
        userId: dto.userId,
        role: dto.role,
      },
      update: {
        role: dto.role,
      },
    });
  }

  async deleteAccount(id: number) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async deleteAccountInGarden(userId: number, gardenId: number) {
    return this.prisma.gardensOnUsers.delete({
      where: {
        userId_gardenId: {
          userId,
          gardenId,
        },
      },
    });
  }

  async uploadAvatarUser(userId: number, path: string) {
    console.log({ path });
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        path: path || '',
      },
    });
  }
}

export interface IAuthRepository {
  getUserByEmail(arg: Prisma.UserFindFirstArgs): Promise<User>;
  createUser(arg: Prisma.UserCreateInput): Promise<User>;
  updateInformation(arg: Prisma.UserUpdateArgs): Promise<User>;
  getUserIdsInGardensOnUsers(gardenId?: number): Promise<{ userId: number }[]>;
  getGardensOnUsers(
    arg: Prisma.GardensOnUsersFindManyArgs,
  ): Promise<GardensOnUsers[]>;
  getUsers(arg: Prisma.UserFindManyArgs): Promise<User[]>;
}
