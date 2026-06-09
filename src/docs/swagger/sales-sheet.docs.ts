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
import { CreateSalesSheetDto } from 'src/sales-sheet/dto/create-sales-sheet.dto';
import { UpdateSalesSheetDto } from 'src/sales-sheet/dto/update-sales-sheet.dto';

export const SalesSheetControllerDocs = () =>
  applyDecorators(ApiTags('Sales Sheet'), ApiBearerAuth('JWT-auth'));

export const CreateSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear hoja de venta' }),
    ApiBody({
      type: CreateSalesSheetDto,
      examples: {
        ruta: {
          summary: 'Hoja de venta diaria por ruta',
          value: {
            employeeId: 2,
            date: '2026-06-03',
            description: 'Hoja de ventas zona norte - ruta 1',
            billId: 5,
          },
        },
        especial: {
          summary: 'Pedido especial',
          value: {
            employeeId: 3,
            date: '2026-06-03',
            description: 'Pedido especial supermercado central',
            billId: 8,
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Hoja de venta creada exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllSalesSheetsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar hojas de venta' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página (default: 10)' }),
    ApiOkResponse({ description: 'Lista paginada de hojas de venta' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener hoja de venta por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la hoja de venta' }),
    ApiOkResponse({ description: 'Hoja de venta encontrada' }),
    ApiNotFoundResponse({ description: 'Hoja de venta no encontrada' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar hoja de venta' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la hoja de venta' }),
    ApiBody({
      type: UpdateSalesSheetDto,
      examples: {
        corregirDescripcion: {
          summary: 'Corregir descripción y empleado',
          value: {
            employeeId: 4,
            date: '2026-06-03',
            description: 'Hoja de ventas zona sur - ruta 2 (corregida)',
            billId: 5,
          },
        },
      },
    }),
    ApiOkResponse({ description: 'Hoja de venta actualizada exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Hoja de venta no encontrada' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar hoja de venta' }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la hoja de venta' }),
    ApiOkResponse({ description: 'Hoja de venta eliminada exitosamente' }),
    ApiNotFoundResponse({ description: 'Hoja de venta no encontrada' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
