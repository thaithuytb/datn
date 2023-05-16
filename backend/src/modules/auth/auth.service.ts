import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { sign, verify } from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { responseSuccess } from '../../common/responseSuccess';
import {
  LoginType,
  UserDetail,
  UserResponseDetail,
  UserResponseDetailType,
} from './models/auth.model';
import { RegisterDto } from './dto/register.dto';
import { uuid } from 'uuidv4';
import { Prisma } from '@prisma/client';
import { UpdateInformationDto } from './dto/auth.dto';

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
      fullName: uuid(),
      email: dto.email,
      password: hashedPassword,
    });

    const token = await this.signToken(newUser.id, newUser.email);

    return responseSuccess(201, {
      user: UserResponseDetail.transform(newUser),
      token,
    });
  }

  async updateInformation(
    userId: number,
    dto: UpdateInformationDto,
  ): Promise<UserResponseDetailType> {
    const user = await this.authRepository.updateInformation({
      where: {
        id: userId,
      },
      data: dto,
    });

    return responseSuccess(200, UserResponseDetail.transform(user));
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
      expiresIn: '1h',
    });
  }

  async verifyToken(token: string) {
    return verify(token, process.env.JWT_SECRET);
  }
}
