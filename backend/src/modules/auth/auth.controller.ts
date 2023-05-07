import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginType } from './models/auth.model';
import { RegisterDto } from './dto/register.dto';
import { RoleAdminGuard } from '../../guards/roleAdminGuard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // TODO: fix after discussing with Mr. Hai
  @Post('/login')
  login(@Body('dto') dto: LoginDto): Promise<LoginType> {
    return this.authService.login(dto);
  }

  @UseGuards(RoleAdminGuard)
  @Post('/register')
  register(@Body('dto') dto: RegisterDto): Promise<LoginType> {
    return this.authService.register(dto);
  }
}
