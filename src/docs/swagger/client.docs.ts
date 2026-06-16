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
import { ContactStatus } from '@prisma/client';
import { CreateClientDto } from 'src/client/dto/create-client.dto';
import { UpdateClientDto } from 'src/client/dto/update-client.dto';
import { UpdateContactStatusDto } from 'src/client/dto/update-contact-status.dto';
import { CreatePurchaseDto } from 'src/client/dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from 'src/client/dto/update-purchase-status.dto';

export const ClientControllerDocs = () =>
  applyDecorators(ApiTags('Clients'), ApiBearerAuth('JWT-auth'));

export const CreateClientDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear cliente' }),
    ApiBody({
      type: CreateClientDto,
      examples: {
        completo: {
          summary: 'Cliente con todos los campos',
          value: {
            fullname: 'Pedro Rodríguez',
            address: 'Av. Las Condes 4500',
            n_depto_casa: 'Dpto 12',
            referencia: 'Frente al mall',
            phone: '+56912345678',
            email: 'pedro.rodriguez@email.com',
            communeId: 1,
            frequency: 30,
            contactStatus: 'LLAMAR',
          },
        },
        minimo: {
          summary: 'Cliente mínimo',
          value: {
            fullname: 'Ana Silva',
            address: 'Calle Blanco 210',
            phone: '+56987654321',
            email: 'ana.silva@email.com',
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Cliente creado exitosamente' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindAllClientsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar clientes',
      description: 'Retorna lista paginada con frecuencias incluidas. Recalcula y persiste el contactStatus según frecuencia de compra en cada consulta.',
    }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'contactStatus', required: false, enum: ContactStatus, description: 'Filtrar por estado de contacto' }),
    ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar por nombre del cliente (insensible a mayúsculas)' }),
    ApiQuery({ name: 'communeId', required: false, type: Number, description: 'Filtrar por ID de comuna' }),
    ApiQuery({ name: 'regionId', required: false, type: Number, description: 'Filtrar por ID de región (filtra via la comuna asociada)' }),
    ApiOkResponse({ description: 'Lista paginada de clientes con sus frecuencias' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const FindOneClientDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener cliente por ID', description: 'Incluye frecuencias y recalcula contactStatus' }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Cliente encontrado' }),
    ApiNotFoundResponse({ description: 'Cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateClientDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar datos del cliente' }),
    ApiParam({ name: 'id', type: Number }),
    ApiBody({
      type: UpdateClientDto,
      examples: {
        actualizar: {
          summary: 'Actualizar dirección y teléfono',
          value: { address: 'Av. Apoquindo 9000, Of. 5', phone: '+56911111222' },
        },
      },
    }),
    ApiOkResponse({ description: 'Cliente actualizado' }),
    ApiBadRequestResponse({ description: 'Datos inválidos' }),
    ApiNotFoundResponse({ description: 'Cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdateContactStatusDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Actualizar estado de contacto manualmente' }),
    ApiParam({ name: 'id', type: Number }),
    ApiBody({
      type: UpdateContactStatusDto,
      examples: {
        llamar: { summary: 'Marcar para llamar', value: { contactStatus: 'LLAMAR' } },
        contactado: { summary: 'Marcar como contactado', value: { contactStatus: 'CONTACTADO' } },
      },
    }),
    ApiOkResponse({ description: 'Estado actualizado' }),
    ApiNotFoundResponse({ description: 'Cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RemoveClientDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Eliminar cliente (soft delete)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Cliente eliminado' }),
    ApiNotFoundResponse({ description: 'Cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const RegisterPurchaseDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Registrar compra (PENDIENTE)',
      description: 'Crea la compra en estado PENDIENTE. No actualiza frecuencia ni contactStatus hasta que se FINALICE.',
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID del cliente' }),
    ApiBody({
      type: CreatePurchaseDto,
      examples: {
        ejemplo: {
          summary: 'Compra con fecha real de entrega',
          value: { productsId: 1, quantity: 3, unitPrice: 4500, purchaseDate: '2026-06-04T00:00:00.000Z' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Compra creada en estado PENDIENTE' }),
    ApiNotFoundResponse({ description: 'Cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const UpdatePurchaseStatusDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Finalizar o anular compra',
      description: `
**FINALIZADO**: actualiza frecuencia del cliente (actualPurchaseDate, avgDaysBetweenPurchases, nextEstimatedDate) y cambia contactStatus → CONTACTADO.

**ANULADO**: solo marca la compra como anulada, no realiza ninguna otra acción.

Solo se puede cambiar el estado de una compra que esté en PENDIENTE.`,
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID del cliente' }),
    ApiParam({ name: 'purchaseId', type: Number, description: 'ID de la compra' }),
    ApiBody({
      type: UpdatePurchaseStatusDto,
      examples: {
        finalizar: { summary: 'Finalizar compra', value: { purchaseStatus: 'FINALIZADO' } },
        anular: { summary: 'Anular compra', value: { purchaseStatus: 'ANULADO' } },
      },
    }),
    ApiOkResponse({ description: 'Estado de compra actualizado' }),
    ApiNotFoundResponse({ description: 'Compra o cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const GetClientPurchasesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Historial de compras del cliente (paginado)',
      description: 'Paginación fija de 5 registros por página. Filtrable por producto y rango de fechas de compra.',
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID del cliente' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    ApiQuery({ name: 'productsId', required: false, type: Number, description: 'Filtrar por ID de producto' }),
    ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha inicio (ISO 8601): 2026-01-01' }),
    ApiQuery({ name: 'endDate', required: false, type: String, description: 'Fecha fin (ISO 8601): 2026-12-31' }),
    ApiOkResponse({ description: 'Compras paginadas (5 por página) con purchaseStatus y purchaseDate' }),
    ApiNotFoundResponse({ description: 'Cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const GetClientFrequencyDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Frecuencia de compra por producto',
      description: 'Retorna datos de frecuencia con daysSinceLastPurchase calculado en tiempo real.',
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiOkResponse({ description: 'Frecuencias del cliente por producto' }),
    ApiNotFoundResponse({ description: 'Cliente no encontrado' }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
