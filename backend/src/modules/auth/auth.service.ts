import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { sign, verify } from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { responseSuccess } from '../../common/responseSuccess';
import { LoginType } from './models/auth.model';
import { RegisterDto } from './dto/register.dto';
import { uuid } from 'uuidv4';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(dto: LoginDto): Promise<LoginType> {
    const existUser = await this.authRepository.getUserByEmail(dto.email);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = existUser;

    return responseSuccess(200, { user: responseUser as User, token });
  }

  async register(dto: RegisterDto): Promise<LoginType> {
    const existUser = await this.authRepository.getUserByEmail(dto.email);

    if (existUser) {
      throw new HttpException('Email is existed', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon2.hash(dto.password);

    const newUser = await this.authRepository.createUser({
      name: uuid(),
      email: dto.email,
      password: hashedPassword,
    });

    const token = await this.signToken(newUser.id, newUser.email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = newUser;

    return responseSuccess(201, { user: responseUser as User, token });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.authRepository.getUserByEmail(email);
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
