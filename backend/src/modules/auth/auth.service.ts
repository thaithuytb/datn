import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { sign, verify } from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { responseSuccess } from '../../common/responseSuccess';
import {
  GardenRoleAndUsers,
  GardensOnUsersType,
  LoginType,
  UserDetail,
  UserResponseDetail,
  UserResponseDetailType,
  UsersWithGardensOnUsersType,
} from './models/auth.model';
import { RegisterDto } from './dto/register.dto';
import { uuid } from 'uuidv4';
import { Prisma, User } from '@prisma/client';
import { UpdateInformationDto } from './dto/auth.dto';
import { UpsertGardensOnUsers } from './dto/gardensOnUsers.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(dto: LoginDto): Promise<LoginType> {
    const existUser = await this.authRepository.getUserByEmail({
      where: {
        email: dto.email,
      },
    });

    if (!existUser) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const correctPassword = await argon2.verify(
      existUser.password,
      dto.password,
    );
    if (!correctPassword) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.signToken(existUser.id, existUser.email);

    return responseSuccess(200, {
      user: UserResponseDetail.transform(existUser),
      token,
    });
  }

  async register(dto: RegisterDto): Promise<LoginType> {
    const existUser = await this.authRepository.getUserByEmail({
      where: {
        email: dto.email,
      },
    });

    if (existUser) {
      throw new HttpException('Email is existed', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon2.hash(dto.password);

    const newUser = await this.authRepository.createUser({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName ? dto.fullName : uuid(),
      phoneNumber: dto.phoneNumber,
      gender: dto.gender,
      address: dto.address,
    });

    const token = await this.signToken(newUser.id, newUser.email);

    return responseSuccess(201, {
      user: UserResponseDetail.transform(newUser),
      token,
    });
  }

  async updateInformation(
    user: User,
    dto: UpdateInformationDto,
  ): Promise<UserResponseDetailType> {
    const { password, newPassword, ...restDto } = dto;
    if (password && newPassword) {
      const correctPassword = await argon2.verify(user.password, password);
      if (!correctPassword) {
        throw new HttpException('wrong password', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await argon2.hash(newPassword);

      const newUser = await this.authRepository.updateInformation({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      return responseSuccess(200, UserResponseDetail.transform(newUser));
    }
    const newUser = await this.authRepository.updateInformation({
      where: {
        id: user.id,
      },
      data: restDto,
    });

    return responseSuccess(200, UserResponseDetail.transform(newUser));
  }

  async getUserByEmail(email: string): Promise<UserDetail> {
    const query: Prisma.UserFindFirstArgsBase = {
      where: {
        email,
      },
      include: {
        gardens: {
          select: {
            gardenId: true,
          },
        },
      },
    };
    const user = (await this.authRepository.getUserByEmail(
      query,
    )) as UserDetail;

    return user;
  }

  private async signToken(id: number, email: string): Promise<string> {
    return sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: '10000h',
    });
  }

  async verifyToken(token: string) {
    return verify(token, process.env.JWT_SECRET);
  }

  async getGardenRoleAndUsers(
    page: number,
    limit: number,
    gardenId?: number,
  ): Promise<UsersWithGardensOnUsersType> {
    const countRecords =
      await this.authRepository.getCountUsersOrUsersOnGardens(gardenId);
    let result;
    if (gardenId) {
      const condition: Prisma.GardensOnUsersFindManyArgs = {
        where: {
          gardenId,
        },
        select: {
          role: true,
          createdAt: true,
          user: true,
          garden: true,
        },
        take: limit,
        skip: (page - 1) * limit,
      };
      const listUserWithGardenRoleOnUser =
        (await this.authRepository.getGardensOnUsers(
          condition,
        )) as unknown as GardenRoleAndUsers[];
      result = listUserWithGardenRoleOnUser.map((u) => ({
        gardens: [
          {
            role: u.role,
            createdAt: u.createdAt,
            name: u.garden.name,
          },
        ],
        user: UserResponseDetail.transform(u.user),
      }));
    } else {
      const condition: Prisma.UserFindManyArgs = {
        where: {
          isDeleted: false,
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          gardens: {
            select: {
              role: true,
              createdAt: true,
              garden: true,
            },
          },
        },
      };
      const listUserWithGardenRoleOnUser = (await this.authRepository.getUsers(
        condition,
      )) as any;
      result = listUserWithGardenRoleOnUser.map((u) => {
        return {
          gardens: u.gardens.map((garden) => ({
            role: garden.role,
            createdAt: garden.createdAt,
            name: garden.garden.name,
          })),
          user: UserResponseDetail.transform(u),
        };
      });
    }
    return responseSuccess(200, {
      totalRecords: countRecords,
      users: result,
    });
  }

  async getUsersWithoutGardenId(
    gardenId: number,
  ): Promise<UsersWithGardensOnUsersType> {
    const condition: Prisma.UserFindManyArgs = {
      where: {
        gardens: {
          every: {
            NOT: {
              gardenId: gardenId,
            },
          },
        },
      },
    };
    const result = await this.authRepository.getUsers(condition);
    return responseSuccess(200, {
      users: result,
    });
  }

  async upsertGardensOnUsers(
    dto: UpsertGardensOnUsers,
  ): Promise<GardensOnUsersType> {
    const result = await this.authRepository.upsertGardenOnUser(dto);
    return responseSuccess(201, result);
  }

  async getUsersByName(name: string) {
    const users = await this.authRepository.getUsersByName(name);
    return responseSuccess(200, users);
  }

  async deleteAccount(id: number) {
    await this.authRepository.deleteAccount(id);
    return {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  async deleteAccountInGarden(userId: number, gardenId: number) {
    await this.authRepository.deleteAccountInGarden(userId, gardenId);
    return {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
    };
  }
}
