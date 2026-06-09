import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

export const UserControllerDocs = () =>
  applyDecorators(ApiTags('Users'), ApiBearerAuth('JWT-auth'));

export const CreateUserDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear usuario' }),
    ApiBody({
      type: CreateUserDto,
      examples: {
        administrador: {
          summary: 'Usuario administrador',
          value: {
            email: 'maria.gomez@gestion.com',
            fullName: 'María Gómez',
            password: 'clave1234',
            imagen: 'https://ejemplo.com/avatars/maria.jpg',
            rol: 1,
            isActive: true,
          },
        },
        repartidor: {
          summary: 'Usuario repartidor',
          value: {
            email: 'juan.perez@gestion.com',
            fullName: 'Juan Pérez',
            password: 'pass5678',
            imagen: 'https://ejemplo.com/avatars/juan.jpg',
            rol: 2,
            isActive: true,
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Usuario creado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllUsersDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar usuarios', description: 'Retorna lista paginada de usuarios con filtros opcionales' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página (default: 10)' }),
    ApiQuery({ name: 'fullName', required: false, type: String, description: 'Filtrar por nombre' }),
    ApiQuery({ name: 'email', required: false, type: String, description: 'Filtrar por email' }),
    ApiOkResponse({ description: 'Lista paginada de usuarios' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneUserDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener usuario por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiOkResponse({ description: 'Usuario encontrado' }),
    ApiNotFoundResponse({ description: 'Usuario no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateUserDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar usuario' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiBody({
      type: UpdateUserDto,
      examples: {
        actualizarRol: {
          summary: 'Cambiar rol y estado',
          value: {
            email: 'maria.gomez@gestion.com',
            fullName: 'María Gómez',
            password: 'nuevaclave456',
            imagen: 'https://ejemplo.com/avatars/maria-v2.jpg',
            rol: 2,
            isActive: false,
          },
        },
      },
    }),
    ApiOkResponse({ description: 'Usuario actualizado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Usuario no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveUserDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar usuario' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiOkResponse({ description: 'Usuario eliminado exitosamente' }),
    ApiNotFoundResponse({ description: 'Usuario no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
