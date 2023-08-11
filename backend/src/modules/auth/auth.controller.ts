import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  GardensOnUsersType,
  LoginType,
  UserResponseDetailType,
  UsersWithGardensOnUsersType,
} from './models/auth.model';
import { RegisterDto } from './dto/register.dto';
import { RoleAdminGuard } from '../../guards/roleAdminGuard';
import { UpdateInformationDto } from './dto/auth.dto';
import { responseSuccess } from '../../common/responseSuccess';
import { User } from '@prisma/client';
import { UpsertGardensOnUsers } from './dto/gardensOnUsers.dto';
import { OptionalParseIntPipe } from '../../pipes/optional-parse-int-pipe';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // TODO: fix after discussing with Mr. Hai
  @Post('/login')
  async login(@Body('dto') dto: LoginDto): Promise<LoginType> {
    return this.authService.login(dto);
  }

  @Get('/verify-token')
  async verifyToken(@Req() req: any): Promise<LoginType> {
    const authHeader = req.headers.authorization;
    const token =
      authHeader &&
      authHeader.split(' ')[0] === 'Bearer' &&
      authHeader.split(' ')[1];
    return responseSuccess(200, {
      user: req.user,
      token: token,
    });
  }

  @UseGuards(RoleAdminGuard)
  @Post('/register')
  async register(@Body('dto') dto: RegisterDto): Promise<LoginType> {
    return this.authService.register(dto);
  }

  @Patch('/update-information')
  async updateInformation(
    @Req() req: any,
    @Body('dto') dto: UpdateInformationDto,
  ): Promise<UserResponseDetailType> {
    return this.authService.updateInformation(req.user as User, dto);
  }

  @UseGuards(RoleAdminGuard)
  @Get('users')
  async getUsersByGardenId(
    @Query('gardenId', new OptionalParseIntPipe()) gardenId?: number,
    @Query('page', new OptionalParseIntPipe()) page?: number,
    @Query('limit', new OptionalParseIntPipe()) limit?: number,
  ): Promise<UsersWithGardensOnUsersType> {
    return this.authService.getGardenRoleAndUsers(
      page || 1,
      limit || 6,
      gardenId,
    );
  }

  @UseGuards(RoleAdminGuard)
  @Get('users/without')
  async getUsersWithoutGardenId(
    @Query('gardenId', ParseIntPipe) gardenId: number,
  ): Promise<UsersWithGardensOnUsersType> {
    return this.authService.getUsersWithoutGardenId(gardenId);
  }

  @UseGuards(RoleAdminGuard)
  @Post('upsert-gardens-on-users')
  async upsertGardensOnUsers(
    @Body('dto') dto: UpsertGardensOnUsers,
  ): Promise<GardensOnUsersType> {
    return this.authService.upsertGardensOnUsers(dto);
  }

  @UseGuards(RoleAdminGuard)
  @Delete('account/delete')
  async deleteAccount(@Body() dto: { id: number }): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    return this.authService.deleteAccount(dto.id);
  }

  @UseGuards(RoleAdminGuard)
  @Delete('account-garden/delete')
  async deleteAccountInGarden(
    @Body() dto: { userId: number; gardenId: number },
  ): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    return this.authService.deleteAccountInGarden(dto.userId, dto.gardenId);
  }
}
