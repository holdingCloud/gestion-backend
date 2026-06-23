import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthControllerDocs, LoginDocs, LogoutDocs, RefreshTokenDocs } from 'src/docs/swagger/auth.docs';

@Controller('auth')
@AuthControllerDocs()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @LoginDocs()
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @LogoutDocs()
  async logout(@Req() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Sesión cerrada correctamente' };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @RefreshTokenDocs()
  refresh(@Req() req) {
    const user = req.user;
    return this.authService.refreshTokens(user.sub, user.email);
  }
}
