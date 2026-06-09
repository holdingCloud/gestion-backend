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
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';

export const ProductControllerDocs = () =>
  applyDecorators(ApiTags('Product'), ApiBearerAuth('JWT-auth'));

export const CreateProductDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear producto' }),
    ApiBody({
      type: CreateProductDto,
      examples: {
        alimenticio: {
          summary: 'Producto alimenticio',
          value: {
            name: 'Aceite de Oliva Extra Virgen',
            description: 'Aceite de oliva importado, botella 500ml',
            quantity: 100,
            img: 'https://ejemplo.com/productos/aceite-oliva.jpg',
            code: 'ACEIT-001',
            available: true,
          },
        },
        limpieza: {
          summary: 'Producto de limpieza',
          value: {
            name: 'Detergente Líquido',
            description: 'Detergente concentrado para ropa, 1 litro',
            quantity: 200,
            img: 'https://ejemplo.com/productos/detergente.jpg',
            code: 'LIMPZ-012',
            available: true,
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Producto creado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllProductsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar productos' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página (default: 10)' }),
    ApiOkResponse({ description: 'Lista paginada de productos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneProductDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener producto por ID' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del producto' }),
    ApiOkResponse({ description: 'Producto encontrado' }),
    ApiNotFoundResponse({ description: 'Producto no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateProductDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar producto' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del producto' }),
    ApiBody({
      type: UpdateProductDto,
      examples: {
        actualizarStock: {
          summary: 'Actualizar stock y disponibilidad',
          value: {
            name: 'Aceite de Oliva Extra Virgen',
            description: 'Aceite de oliva importado, botella 500ml',
            quantity: 50,
            img: 'https://ejemplo.com/productos/aceite-oliva.jpg',
            code: 'ACEIT-001',
            available: false,
          },
        },
      },
    }),
    ApiOkResponse({ description: 'Producto actualizado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Producto no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveProductDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar producto' }),
    ApiParam({ name: 'id', type: Number, description: 'ID del producto' }),
    ApiOkResponse({ description: 'Producto eliminado exitosamente' }),
    ApiNotFoundResponse({ description: 'Producto no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
