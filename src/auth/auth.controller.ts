import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Auth, AuthenticatedRequest } from '@common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('me')
  @Auth()
  async me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user);
  }
}
