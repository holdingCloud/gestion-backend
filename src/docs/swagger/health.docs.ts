import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';

export const HealthControllerDocs = () => applyDecorators(ApiTags('Health'));

export const HealthCheckDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Estado del servicio', description: 'Retorna el estado general del servidor' }),
    ApiOkResponse({ description: 'Servicio operativo' }),
  );

export const DatabaseHealthCheckDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Estado de la base de datos', description: 'Verifica conectividad con la base de datos PostgreSQL' }),
    ApiOkResponse({ description: 'Base de datos conectada' }),
    ApiServiceUnavailableResponse({ description: 'Base de datos no disponible' }),
  );
