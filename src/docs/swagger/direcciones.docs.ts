import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const DireccionesControllerDocs = () => applyDecorators(ApiTags('Direcciones'), ApiBearerAuth());

export const CreateDireccionDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Crear dirección',
      description: 'Crea una dirección asociada a un cliente, empleado o empresa. Usar el campo `tipo` para indicar el propósito (PRINCIPAL, DESPACHO, FACTURACION, etc.).',
    }),
    ApiCreatedResponse({ description: 'Dirección creada exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
  );

export const FindAllDireccionesDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar direcciones', description: 'Retorna las direcciones filtradas opcionalmente por tipo.' }),
    ApiQuery({ name: 'tipo', required: false, enum: ['PRINCIPAL','FACTURACION','DESPACHO','COMERCIAL','TRABAJO','SUCURSAL','BODEGA','OTRO'] }),
    ApiOkResponse({ description: 'Lista de direcciones' }),
  );

export const FindOneDireccionDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener una dirección por id' }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Dirección encontrada' }),
    ApiNotFoundResponse({ description: 'Dirección no encontrada' }),
  );

export const UpdateDireccionDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar dirección' }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Dirección actualizada' }),
    ApiNotFoundResponse({ description: 'Dirección no encontrada' }),
  );

export const DeleteDireccionDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar dirección' }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Dirección eliminada' }),
    ApiNotFoundResponse({ description: 'Dirección no encontrada' }),
  );
