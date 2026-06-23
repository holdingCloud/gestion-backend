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
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';

export const EmployeeControllerDocs = () =>
  applyDecorators(ApiTags('Employee'), ApiBearerAuth('JWT-auth'));

export const CreateEmployeeDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear empleado' }),
    ApiBody({
      type: CreateEmployeeDto,
      examples: {
        repartidor: {
          summary: 'Empleado repartidor',
          value: {
            rut: '12.345.678-9',
            fullname: 'Carlos Muñoz',
            email: 'carlos.munoz@empresa.com',
            salary: 650000,
            hireDate: '2024-03-15',
            type: 'REPARTIDOR',
            direccionPrincipal: {
              calle: 'Calle Brasil',
              numero: '321',
              communeId: 1,
            },
          },
        },
        administrador: {
          summary: 'Empleado administrador',
          value: {
            rut: '9.876.543-2',
            fullname: 'Laura Vega',
            email: 'laura.vega@empresa.com',
            salary: 1200000,
            hireDate: '2023-01-10',
            type: 'ADMINISTRADOR',
            direccionPrincipal: {
              calle: 'Av. Providencia',
              numero: '500',
              communeId: 1,
            },
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Empleado creado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllEmployeesDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar empleados' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página (default: 10)' }),
    ApiOkResponse({ description: 'Lista paginada de empleados' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneEmployeeDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener empleado por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del empleado' }),
    ApiOkResponse({ description: 'Empleado encontrado' }),
    ApiNotFoundResponse({ description: 'Empleado no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateEmployeeDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar empleado' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del empleado' }),
    ApiBody({
      type: UpdateEmployeeDto,
      examples: {
        actualizarSalario: {
          summary: 'Actualizar salario y dirección',
          value: {
            salary: 750000,
            direccionPrincipal: {
              calle: 'Av. Grecia',
              numero: '1020',
              communeId: 1,
            },
          },
        },
      },
    }),
    ApiOkResponse({ description: 'Empleado actualizado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Empleado no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveEmployeeDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar empleado' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del empleado' }),
    ApiOkResponse({ description: 'Empleado eliminado exitosamente' }),
    ApiNotFoundResponse({ description: 'Empleado no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
