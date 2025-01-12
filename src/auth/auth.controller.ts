import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from 'src/dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userServices: UsersService,
  ) {}
  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard) // 透過 passport, db username 對比hashPassword 檢查帳密是否正確
  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto, @Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard) // 檢查 token 是否正確
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.authService.register(email, password);
    console.log(user, 'user????');
    if (user) {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  }
}
