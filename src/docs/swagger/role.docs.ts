import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { UpdateRoleDto } from 'src/role/dto/update-role.dto';

export const RoleControllerDocs = () =>
  applyDecorators(ApiTags('Roles'), ApiBearerAuth('JWT-auth'));

export const CreateRoleDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create role' }),
    ApiBody({
      type: CreateRoleDto,
      examples: {
        admin: { summary: 'Rol estándar', value: { type: 'ADMINISTRADOR' } },
        custom: { summary: 'Rol personalizado', value: { type: 'BODEGUERO' } },
        supervisor: { summary: 'Rol personalizado 2', value: { type: 'SUPERVISOR_VENTAS' } },
      },
    }),
    ApiCreatedResponse({ description: 'Role created successfully' }),
    ApiBadRequestResponse({ description: 'Invalid data or duplicate type' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const FindAllRolesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'List all roles',
      description: 'Returns all roles ordered by type. Includes user count (`_count.user`).',
    }),
    ApiOkResponse({ description: 'List of roles' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const FindOneRoleDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get role by ID' }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Role found' }),
    ApiNotFoundResponse({ description: 'Role not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const UpdateRoleDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update role' }),
    ApiParam({ name: 'id', type: Number }),
    ApiBody({ type: UpdateRoleDto }),
    ApiOkResponse({ description: 'Role updated' }),
    ApiNotFoundResponse({ description: 'Role not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

export const RemoveRoleDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete role',
      description: 'Permanently deletes the role. Will fail if there are users assigned to it.',
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Role deleted' }),
    ApiNotFoundResponse({ description: 'Role not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
