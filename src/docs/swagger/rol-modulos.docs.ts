import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Modulo } from '@prisma/client';

export const RolModulosControllerDocs = () =>
  applyDecorators(ApiTags('Rol-Módulos'), ApiBearerAuth('JWT-auth'));

export const GetAllRolesDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar todos los roles con sus módulos' }),
    ApiOkResponse({ description: 'Roles con módulos asignados' }),
  );

export const GetModulosByRolDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener módulos de un rol' }),
    ApiParam({ name: 'rolId', type: Number }),
    ApiOkResponse({ description: 'Lista de módulos del rol', schema: { example: ['CLIENTES', 'VENTAS', 'REPORTES'] } }),
    ApiNotFoundResponse({ description: 'Rol no encontrado' }),
  );

export const SetModulosDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Asignar módulos a un rol (reemplaza todos)',
      description: 'Reemplaza completamente los módulos del rol. Para quitar todos los accesos, enviar `modulos: []`.',
    }),
    ApiParam({ name: 'rolId', type: Number }),
    ApiOkResponse({ description: 'Módulos actualizados' }),
    ApiNotFoundResponse({ description: 'Rol no encontrado' }),
    ApiBadRequestResponse({ description: 'Módulo inválido' }),
  );

export const AddModuloDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Agregar un módulo al rol' }),
    ApiParam({ name: 'rolId', type: Number }),
    ApiParam({ name: 'modulo', enum: Modulo }),
    ApiOkResponse({ description: 'Módulo agregado' }),
    ApiNotFoundResponse({ description: 'Rol no encontrado' }),
  );

export const RemoveModuloDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Quitar un módulo del rol' }),
    ApiParam({ name: 'rolId', type: Number }),
    ApiParam({ name: 'modulo', enum: Modulo }),
    ApiOkResponse({ description: 'Módulo eliminado' }),
    ApiNotFoundResponse({ description: 'Rol o módulo no encontrado' }),
  );
