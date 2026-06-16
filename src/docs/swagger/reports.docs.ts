import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ClientReportOrderBy, ReportPeriod } from 'src/reports/dto/reports-filter.dto';

export const ReportsControllerDocs = () =>
  applyDecorators(ApiTags('Reports'), ApiBearerAuth('JWT-auth'));

// ─── Filtros comunes ─────────────────────────────────────────────────────────

const DateRangeQueries = () =>
  applyDecorators(
    ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha inicio (ISO 8601) — ej: 2026-01-01' }),
    ApiQuery({ name: 'endDate',   required: false, type: String, description: 'Fecha fin   (ISO 8601) — ej: 2026-06-30' }),
    ApiQuery({ name: 'communeId', required: false, type: Number, description: 'Filtrar por ID de comuna' }),
    ApiQuery({ name: 'companyId', required: false, type: Number, description: 'Filtrar por ID de empresa' }),
  );

const PeriodQuery = () =>
  ApiQuery({ name: 'period', required: false, enum: ReportPeriod, description: 'Agrupación temporal: day | week | month (default: day)' });

// ─── Endpoints ───────────────────────────────────────────────────────────────

export const SalesByProductDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reporte de ventas por producto',
      description: `Retorna dos estructuras:
- **byProduct**: totales por producto — finalizadas, anuladas, % anulación y monto total.
- **byPeriod**: serie temporal agrupada por \`period\` (day/week/month) con conteos de finalizadas y anuladas.

Filtros opcionales: rango de fechas, comuna y agrupación temporal.`,
    }),
    DateRangeQueries(),
    PeriodQuery(),
    ApiOkResponse({
      description: 'byProduct[] + byPeriod[]',
      schema: {
        example: {
          byProduct: [
            { productId: 1, productName: 'Gas 11kg', productCode: 'GN001', total: 50, finalized: 40, canceled: 8, pending: 2, cancelRate: 16.0, totalAmount: 180000 },
          ],
          byPeriod: [
            { period: '2026-01-01T00:00:00.000Z', total: 6, finalized: 5, canceled: 1 },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const ClientPurchasesReportDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reporte de compras por cliente entre fechas',
      description: `Por cada cliente retorna:
- Cantidad de compras en el rango de fechas.
- Frecuencia de compra (días promedio entre compras) registrada en \`ClientProductFrequency\`.
- Monto total de compras finalizadas en el rango.

Ordenable por **frecuencia** (más frecuente primero), **purchaseCount** o **totalAmount**.`,
    }),
    DateRangeQueries(),
    ApiQuery({ name: 'clientId', required: false, type: Number, description: 'Filtrar por ID de cliente específico' }),
    ApiQuery({ name: 'orderBy',  required: false, enum: ClientReportOrderBy, description: 'frequency | purchases | amount (default: frequency)' }),
    ApiOkResponse({
      description: 'Array de clientes con sus métricas de compra',
      schema: {
        example: [
          { clientId: 1, clientName: 'Pedro Rodríguez', communeName: 'Las Condes', companyName: 'Empresa ABC', purchaseCount: 5, avgDaysBetweenPurchases: 12.5, totalAmount: 45000 },
        ],
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const SalesEvolutionDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reporte de evolución de ventas por período',
      description: `Retorna:
- **series**: monto y conteo de transacciones agrupados por el período elegido (day/week/month).
- **summary**: comparativo automático contra el período anterior de igual duración, con variación porcentual de monto y transacciones.`,
    }),
    DateRangeQueries(),
    PeriodQuery(),
    ApiOkResponse({
      description: 'Serie temporal + resumen comparativo',
      schema: {
        example: {
          series: [{ period: '2026-01-01T00:00:00.000Z', transactionCount: 5, totalAmount: 25000 }],
          summary: {
            currentTotal: 250000, currentTxCount: 48,
            previousTotal: 200000, previousTxCount: 40,
            variationAmount: 25.0, variationTx: 20.0,
            previousPeriod: { start: '2025-06-16', end: '2025-12-30' },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const InactiveClientsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reporte de clientes sin compras recientes',
      description: `Cruza la frecuencia histórica del cliente con los días transcurridos desde su última compra.

**Niveles de alerta**:
- \`NORMAL\` — días sin comprar ≤ frecuencia habitual.
- \`ATENCION\` — días sin comprar entre 1× y 1.5× la frecuencia.
- \`RIESGO\` — días sin comprar > 1.5× la frecuencia.

Ordenado de mayor a menor desviación respecto a su frecuencia habitual. Solo incluye clientes con frecuencia registrada y al menos una compra finalizada.`,
    }),
    ApiQuery({ name: 'communeId', required: false, type: Number, description: 'Filtrar por ID de comuna' }),
    ApiQuery({ name: 'companyId', required: false, type: Number, description: 'Filtrar por ID de empresa' }),
    ApiOkResponse({
      description: 'Array de clientes con nivel de alerta y desviación',
      schema: {
        example: [
          { clientId: 3, clientName: 'Ana Silva', communeName: 'Providencia', companyName: 'Empresa ABC', frequency: 30, lastPurchaseDate: '2026-03-01', avgDaysBetweenPurchases: 28.5, daysSinceLastPurchase: 75, deviation: 45, alertLevel: 'RIESGO' },
        ],
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const TopClientsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Top clientes por frecuencia de compra',
      description: `Ordena los clientes de mayor a menor frecuencia (menor avgDaysBetweenPurchases = más frecuente).
Incluye monto total comprado y cantidad de compras finalizadas en el rango de fechas dado.

Solo incluye clientes con frecuencia calculada.`,
    }),
    DateRangeQueries(),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de clientes a retornar (default: 10)' }),
    ApiOkResponse({
      description: 'Array de clientes top ordenados por frecuencia',
      schema: {
        example: [
          { rank: 1, clientId: 7, clientName: 'Carlos Muñoz', communeName: 'Santiago', companyName: 'Empresa XYZ', avgDaysBetweenPurchases: 5, totalAmount: 180000, purchaseCount: 24 },
        ],
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const AvgPurchaseFrequencyDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Frecuencia media de compra',
      description: `Calcula el promedio global de días entre compras entre todos los clientes activos.

Retorna además un **histograma** que muestra cuántos clientes compran cada cuántos días (rangos: 1-7, 8-14, 15-30, 31-60, 61+).

El filtro de fechas aplica sobre la \`actualPurchaseDate\` registrada en \`ClientProductFrequency\`.`,
    }),
    DateRangeQueries(),
    ApiOkResponse({
      description: 'Promedio global + histograma de distribución',
      schema: {
        example: {
          globalAvg: 18.5,
          histogram: [
            { range: '1-7 días',   minDays: 1,  clientCount: 5 },
            { range: '8-14 días',  minDays: 8,  clientCount: 10 },
            { range: '15-30 días', minDays: 15, clientCount: 15 },
            { range: '31-60 días', minDays: 31, clientCount: 8 },
            { range: '61+ días',   minDays: 61, clientCount: 3 },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );

export const DailyKpisDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Dashboard de KPIs del día',
      description: `KPIs del día solicitado (default: hoy) comparados automáticamente contra el día anterior.

**Métricas**:
- \`finalized\` — compras finalizadas del día.
- \`canceled\` — compras anuladas del día.
- \`totalAmount\` — monto total vendido (solo FINALIZADO).
- \`avgTicket\` — ticket promedio del día.
- \`newClients\` — clientes creados en el día.
- \`vs\` — delta de cada métrica contra el día anterior (positivo = mejora).`,
    }),
    ApiQuery({ name: 'date',      required: false, type: String, description: 'Fecha a consultar (ISO 8601) — default: hoy' }),
    ApiQuery({ name: 'communeId', required: false, type: Number, description: 'Filtrar por ID de comuna' }),
    ApiQuery({ name: 'companyId', required: false, type: Number, description: 'Filtrar por ID de empresa' }),
    ApiOkResponse({
      description: 'KPIs del día con comparativa vs día anterior',
      schema: {
        example: {
          date: '2026-06-15',
          finalized: 12, canceled: 2, totalAmount: 54000, avgTicket: 4500, newClients: 3,
          vs: { finalized: 2, canceled: -1, totalAmount: 4500, avgTicket: 500, newClients: 1 },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
