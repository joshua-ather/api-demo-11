import { Body, Controller, InternalServerErrorException, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);

    if (!result.data || !result.data.refreshToken) {
      throw new InternalServerErrorException('Missing refresh token');
    }

    const { refreshToken, ...rest } = result.data;

    // Set refresh token as a cookie
    res.cookie('refresh_token', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(result.statusCode);

    return {
      ...result,
      data: rest,
    };
  }
}
