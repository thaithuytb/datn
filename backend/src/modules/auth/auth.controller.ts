import {
  Body,
  Controller,
  Get,
  Param,
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
  GardenRoleAndUsersType,
  GardensOnUsersType,
  LoginType,
  UserResponseDetailType,
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

  //Garden on user
  @UseGuards(RoleAdminGuard)
  @Get('users')
  async getUsersByName(@Query('name') name?: string): Promise<any> {
    return this.authService.getUsersByName(name);
  }

  @UseGuards(RoleAdminGuard)
  @Get('users/:gardenId')
  async getUsersByGardenId(
    @Param('gardenId', ParseIntPipe) gardenId: number,
    @Query('page', new OptionalParseIntPipe()) page?: number,
    @Query('limit', new OptionalParseIntPipe()) limit?: number,
  ): Promise<GardenRoleAndUsersType> {
    return this.authService.getGardenRoleAndUsersByGardenId(
      gardenId,
      page || 1,
      limit || 6,
    );
  }

  @UseGuards(RoleAdminGuard)
  @Post('upsert-gardens-on-users')
  async upsertGardensOnUsers(
    @Body('dto') dto: UpsertGardensOnUsers,
  ): Promise<GardensOnUsersType> {
    return this.authService.upsertGardensOnUsers(dto);
  }
}
