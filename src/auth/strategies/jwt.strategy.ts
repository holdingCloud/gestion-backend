import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config';
import { RedisService } from 'src/redis/redis.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const activeToken = await this.redisService.get(`session:${payload.id}`);

    if (!activeToken || activeToken !== token) {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }

    return payload;
  }
}
