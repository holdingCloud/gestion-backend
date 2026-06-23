import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/refresh.strategy';
import { envs } from 'src/config';
import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  imports: [
    UserModule,
    RedisModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
