import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RedisService } from 'src/redis/redis.service';

const ACCESS_TOKEN_TTL = 2 * 60 * 60; // 2h en segundos

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      image: user.imagen,
      rolesId: user.rolesId,
      role: user.rol,
      modulos: user.modulos ?? [],
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '2h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Sobreescribe la sesión anterior — solo una sesión activa por usuario
    await this.redisService.set(`session:${user.id}`, accessToken, ACCESS_TOKEN_TTL);

    return { user: payload, accessToken, refreshToken };
  }

  async logout(userId: number): Promise<void> {
    await this.redisService.del(`session:${userId}`);
  }

  async refreshTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return { accessToken };
  }
}