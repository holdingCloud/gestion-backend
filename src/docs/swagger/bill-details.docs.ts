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
import { CreateBillDetailsDto } from 'src/bill-details/dto/create-bill-details.dto';
import { UpdateBillDetailsDto } from 'src/bill-details/dto/update-bill-details.dto';

export const BillDetailsControllerDocs = () =>
  applyDecorators(ApiTags('Bill Details'), ApiBearerAuth('JWT-auth'));

export const CreateBillDetailsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear detalle de factura' }),
    ApiBody({
      type: CreateBillDetailsDto,
      examples: {
        linea: {
          summary: 'Línea de detalle',
          value: { amount: 125000, date: '2026-06-03', billsId: 1 },
        },
        montoAlto: {
          summary: 'Detalle de monto alto',
          value: { amount: 980000, date: '2026-06-03', billsId: 2 },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Detalle de factura creado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllBillDetailsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar detalles de facturas' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página (default: 10)' }),
    ApiOkResponse({ description: 'Lista paginada de detalles de facturas' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneBillDetailsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener detalle de factura por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del detalle' }),
    ApiOkResponse({ description: 'Detalle de factura encontrado' }),
    ApiNotFoundResponse({ description: 'Detalle no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateBillDetailsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar detalle de factura' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del detalle' }),
    ApiBody({
      type: UpdateBillDetailsDto,
      examples: {
        corregirMonto: {
          summary: 'Corregir monto y fecha',
          value: { amount: 135000, date: '2026-06-04', billsId: 1 },
        },
      },
    }),
    ApiOkResponse({ description: 'Detalle actualizado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Detalle no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveBillDetailsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar detalle de factura' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del detalle' }),
    ApiOkResponse({ description: 'Detalle eliminado exitosamente' }),
    ApiNotFoundResponse({ description: 'Detalle no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
