import { Garden, GardensOnUsers, RoleGarden, User } from '@prisma/client';

export interface LoginType {
  statusCode: number;
  success: boolean;
  data: Login;
}

export interface GardenRoleAndUsersType {
  statusCode: number;
  success: boolean;
  data: GardenRoleAndUsers[];
}

export interface GardenRoleAndUsers {
  role: RoleGarden;
  user: User;
}

export interface GardensOnUsersType {
  statusCode: number;
  success: boolean;
  data: GardensOnUsers;
}

export interface Login {
  user: IUserResponseDetail;
  // TODO: can returns refresh token
  token: string;
}

export interface UserDetail extends User {
  gardens: Garden[];
}

export class UserResponseDetail {
  static transform(dto: User): IUserResponseDetail {
    return {
      id: dto.id,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      address: dto.address,
      fullName: dto.fullName,
      gender: dto.gender,
    };
  }
}

export interface UserResponseDetailType {
  statusCode: number;
  success: boolean;
  data: IUserResponseDetail;
}

interface IUserResponseDetail {
  id: number;
  phoneNumber?: string;
  email: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  address?: string;
  fullName: string;
  gender?: string;
}
