import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dto';

export const AuthControllerDocs = () => applyDecorators(ApiTags('Auth'));

export const LoginDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión',
      description: 'Autentica al usuario y retorna access token y refresh token',
    }),
    ApiBody({
      type: LoginDto,
      examples: {
        administrador: {
          summary: 'Login administrador',
          value: { email: 'admin@local.test', password: 'Admin1234' },
        },
        repartidor: {
          summary: 'Login repartidor',
          value: { email: 'carlos.munoz@gestion.com', password: 'clave456' },
        },
      },
    }),
    ApiOkResponse({ description: 'Login exitoso. Retorna accessToken y refreshToken' }),
    ApiBadRequestResponse({ description: 'Datos de entrada inválidos' }),
    ApiUnauthorizedResponse({ description: 'Credenciales incorrectas' }),
  );

export const RefreshTokenDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Refrescar tokens',
      description: 'Genera nuevos tokens usando el refresh token enviado en el header X-Refresh-Token',
    }),
    ApiHeader({
      name: 'X-Refresh-Token',
      description: 'Token de refresco JWT',
      required: true,
    }),
    ApiOkResponse({ description: 'Nuevos tokens generados exitosamente' }),
    ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado' }),
  );
