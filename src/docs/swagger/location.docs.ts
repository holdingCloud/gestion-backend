import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const LocationControllerDocs = () =>
  applyDecorators(ApiTags('Location'), ApiBearerAuth('JWT-auth'));

export const FindAllRegionsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar todas las regiones',
      description: 'Retorna las 16 regiones de Chile ordenadas por ID.',
    }),
    ApiOkResponse({
      description: 'Lista de regiones',
      schema: {
        type: 'array',
        example: [
          { id: 1, name: 'Región de Arica y Parinacota' },
          { id: 2, name: 'Región de Tarapacá' },
          { id: 7, name: 'Región Metropolitana de Santiago' },
        ],
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Región de Arica y Parinacota' },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindCommunesByRegionDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar comunas de una región',
      description: 'Retorna todas las comunas pertenecientes a la región indicada, ordenadas alfabéticamente.',
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID de la región' }),
    ApiOkResponse({
      description: 'Lista de comunas de la región',
      schema: {
        type: 'array',
        example: [
          { id: 1, name: 'Arica', regionId: 1 },
          { id: 2, name: 'Camarones', regionId: 1 },
          { id: 3, name: 'General Lagos', regionId: 1 },
          { id: 4, name: 'Putre', regionId: 1 },
        ],
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Arica' },
            regionId: { type: 'integer', example: 1 },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Región no encontrada',
      schema: {
        example: {
          statusCode: 404,
          timestamp: '2026-06-13T00:00:00.000Z',
          message: 'Región con id 99 no encontrada',
          error: 'NotFoundException',
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
