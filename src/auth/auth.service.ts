import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto): Promise<SuccessResponseDto> {
    const exist = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exist) throw new ConflictException(['email the email already registered']);

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
    });

    await this.userRepo.save(user);

    return {
      success: true,
      message: 'User registered successfully',
      statusCode: 201
    };
  }

  async login(dto: LoginDto): Promise<SuccessResponseDto<{ token: string; refreshToken: string }>> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid email or password');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: user.id }, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync({ sub: user.id }, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    user.token = refreshToken;
    await this.userRepo.save(user);

    return {
      success: true,
      message: 'Login successful',
      statusCode: 200,
      data: { token: accessToken, refreshToken },
    };
  }
}
