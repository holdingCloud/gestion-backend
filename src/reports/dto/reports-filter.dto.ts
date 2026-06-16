import { IsOptional, IsDateString, IsInt, IsEnum, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export enum ClientReportOrderBy {
  FREQUENCY = 'frequency',
  PURCHASES = 'purchases',
  AMOUNT = 'amount',
}

export class BaseFilterDto {
  @ApiPropertyOptional({ description: 'Fecha inicio (ISO 8601)', example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha fin (ISO 8601)', example: '2026-06-30' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de comuna', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  communeId?: number;
}

export class SalesByProductFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ enum: ReportPeriod, description: 'Agrupación temporal del gráfico', default: ReportPeriod.DAY })
  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod;
}

export class ClientPurchasesFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de cliente específico', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;

  @ApiPropertyOptional({ enum: ClientReportOrderBy, description: 'Ordenar por: frecuencia, cantidad de compras o monto', default: ClientReportOrderBy.FREQUENCY })
  @IsOptional()
  @IsEnum(ClientReportOrderBy)
  orderBy?: ClientReportOrderBy;
}

export class SalesEvolutionFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ enum: ReportPeriod, description: 'Agrupación temporal de la serie', default: ReportPeriod.DAY })
  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod;
}

export class TopClientsFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ description: 'Número máximo de clientes a retornar', type: Number, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;
}

export class DailyKpisFilterDto {
  @ApiPropertyOptional({ description: 'Fecha del reporte (ISO 8601). Por defecto: hoy', example: '2026-06-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de comuna', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  communeId?: number;
}
