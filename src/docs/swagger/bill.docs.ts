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
import { CreateBillDto } from 'src/bill/dto/create-bill.dto';
import { UpdateBillDto } from 'src/bill/dto/update-bill.dto';

export const BillControllerDocs = () =>
  applyDecorators(ApiTags('Bill'), ApiBearerAuth('JWT-auth'));

export const CreateBillDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear factura' }),
    ApiBody({
      type: CreateBillDto,
      examples: {
        mensual: {
          summary: 'Factura mensual',
          value: { name: 'Factura Junio 2026' },
        },
        especial: {
          summary: 'Factura especial',
          value: { name: 'Factura Pedido Especial #001' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Factura creada exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllBillsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar facturas' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página (default: 10)' }),
    ApiOkResponse({ description: 'Lista paginada de facturas' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneBillDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener factura por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la factura' }),
    ApiOkResponse({ description: 'Factura encontrada' }),
    ApiNotFoundResponse({ description: 'Factura no encontrada' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateBillDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar factura' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la factura' }),
    ApiBody({
      type: UpdateBillDto,
      examples: {
        renombrar: {
          summary: 'Renombrar factura',
          value: { name: 'Factura Junio 2026 - Corregida' },
        },
      },
    }),
    ApiOkResponse({ description: 'Factura actualizada exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Factura no encontrada' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveBillDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar factura' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la factura' }),
    ApiOkResponse({ description: 'Factura eliminada exitosamente' }),
    ApiNotFoundResponse({ description: 'Factura no encontrada' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
