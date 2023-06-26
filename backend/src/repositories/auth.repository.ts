import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { GardensOnUsers, Prisma, User } from '@prisma/client';
import { GardenRoleAndUsers } from '../modules/auth/models/auth.model';
import { UpsertGardensOnUsers } from '../modules/auth/dto/gardensOnUsers.dto';

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

  async getGardenRoleAndUsersByGardenId(
    gardenId: number,
    page: number,
    limit: number,
  ): Promise<GardenRoleAndUsers[]> {
    return this.prisma.gardensOnUsers.findMany({
      where: {
        gardenId,
      },
      select: {
        role: true,
        user: true,
      },
      distinct: 'userId',
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getCountGardenRoleAndUsersByGardenId(
    gardenId: number,
  ): Promise<number> {
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
}

export interface IAuthRepository {
  getUserByEmail(args: Prisma.UserFindFirstArgs): Promise<User>;
  createUser(args: Prisma.UserCreateInput): Promise<User>;
  updateInformation(args: Prisma.UserUpdateArgs): Promise<User>;
  getUserIdsInGardensOnUsers(gardenId?: number): Promise<{ userId: number }[]>;
  getGardenRoleAndUsersByGardenId(
    gardenId: number,
    page: number,
    limit: number,
  ): Promise<GardenRoleAndUsers[]>;
}
