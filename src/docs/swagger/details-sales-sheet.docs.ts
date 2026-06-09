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
import { CreateDetailsSalesSheetDto } from 'src/details-sales-sheet/dto/create-details-sales-sheet.dto';
import { UpdateDetailsSalesSheetDto } from 'src/details-sales-sheet/dto/update-details-sales-sheet.dto';

export const DetailsSalesSheetControllerDocs = () =>
  applyDecorators(ApiTags('Details Sales Sheet'), ApiBearerAuth('JWT-auth'));

export const CreateDetailsSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear ítem de hoja de venta' }),
    ApiBody({
      type: CreateDetailsSalesSheetDto,
      examples: {
        sinDescuento: {
          summary: 'Ítem sin descuento',
          value: {
            clientsId: 10,
            productsId: 3,
            quantity: 4,
            discount: 0,
            salesSheetId: 1,
          },
        },
        conDescuento: {
          summary: 'Ítem con descuento del 10%',
          value: {
            clientsId: 15,
            productsId: 7,
            quantity: 10,
            discount: 10,
            salesSheetId: 1,
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Ítem creado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllDetailsSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar ítems de hojas de venta' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página (default: 10)' }),
    ApiOkResponse({ description: 'Lista paginada de ítems de hojas de venta' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneDetailsSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener ítem de hoja de venta por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del ítem' }),
    ApiOkResponse({ description: 'Ítem encontrado' }),
    ApiNotFoundResponse({ description: 'Ítem no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateDetailsSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar ítem de hoja de venta' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del ítem' }),
    ApiBody({
      type: UpdateDetailsSalesSheetDto,
      examples: {
        corregirCantidad: {
          summary: 'Corregir cantidad y descuento',
          value: {
            clientsId: 10,
            productsId: 3,
            quantity: 6,
            discount: 5,
            salesSheetId: 1,
          },
        },
      },
    }),
    ApiOkResponse({ description: 'Ítem actualizado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Ítem no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveDetailsSalesSheetDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar ítem de hoja de venta' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del ítem' }),
    ApiOkResponse({ description: 'Ítem eliminado exitosamente' }),
    ApiNotFoundResponse({ description: 'Ítem no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
