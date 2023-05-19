import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginType, UserResponseDetailType } from './models/auth.model';
import { RegisterDto } from './dto/register.dto';
import { RoleAdminGuard } from '../../guards/roleAdminGuard';
import { UpdateInformationDto } from './dto/auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // TODO: fix after discussing with Mr. Hai
  @Post('/login')
  async login(@Body('dto') dto: LoginDto): Promise<LoginType> {
    return this.authService.login(dto);
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
    return this.authService.updateInformation(req.user.id, dto);
  }
}
