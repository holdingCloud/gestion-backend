import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { RedisService } from 'src/redis/redis.service';
import {
  BaseFilterDto,
  ClientPurchasesFilterDto,
  ClientReportOrderBy,
  DailyKpisFilterDto,
  ReportPeriod,
  SalesByProductFilterDto,
  SalesEvolutionFilterDto,
  TopClientsFilterDto,
} from './dto/reports-filter.dto';

const REPORT_TTL    = 900;  // 15 min — reportes históricos
const DAILY_KPI_TTL = 300;  // 5 min  — KPIs del día (más dinámicos)

@Injectable()
export class ReportsService {
  constructor(
    private readonly repo: ReportsRepository,
    private readonly redis: RedisService,
  ) {}

  private async cached<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
    const hit = await this.redis.get(key);
    if (hit) return JSON.parse(hit) as T;
    const result = await fn();
    await this.redis.set(key, JSON.stringify(result), ttl);
    return result;
  }

  salesByProduct(dto: SalesByProductFilterDto) {
    const key = `report:sales-by-product:${dto.startDate ?? ''}:${dto.endDate ?? ''}:${dto.communeId ?? ''}:${dto.companyId ?? ''}:${dto.period ?? ''}`;
    return this.cached(key, REPORT_TTL, () =>
      this.repo.getSalesByProduct(dto.startDate, dto.endDate, dto.communeId, dto.period ?? ReportPeriod.DAY, dto.companyId),
    );
  }

  clientPurchasesReport(dto: ClientPurchasesFilterDto) {
    const key = `report:clients-purchases:${dto.startDate ?? ''}:${dto.endDate ?? ''}:${dto.communeId ?? ''}:${dto.clientId ?? ''}:${dto.orderBy ?? ''}:${dto.companyId ?? ''}`;
    return this.cached(key, REPORT_TTL, () =>
      this.repo.getClientPurchasesReport(
        dto.startDate,
        dto.endDate,
        dto.communeId,
        dto.clientId,
        dto.orderBy ?? ClientReportOrderBy.FREQUENCY,
        dto.companyId,
      ),
    );
  }

  salesEvolution(dto: SalesEvolutionFilterDto) {
    const key = `report:sales-evolution:${dto.startDate ?? ''}:${dto.endDate ?? ''}:${dto.communeId ?? ''}:${dto.companyId ?? ''}:${dto.period ?? ''}`;
    return this.cached(key, REPORT_TTL, () =>
      this.repo.getSalesEvolution(dto.startDate, dto.endDate, dto.communeId, dto.period ?? ReportPeriod.DAY, dto.companyId),
    );
  }

  async inactiveClients(dto: BaseFilterDto) {
    const key = `report:inactive-clients:${dto.communeId ?? ''}:${dto.companyId ?? ''}`;
    return this.cached(key, REPORT_TTL, async () => {
      const rows = await this.repo.getInactiveClients(dto.communeId, dto.companyId);
      return rows.map((row) => {
        const frequency = Number(row.frequency ?? 0);
        const days = Number(row.daysSinceLastPurchase ?? 0);
        let alertLevel: 'NORMAL' | 'ATENCION' | 'RIESGO';
        if (days <= frequency) alertLevel = 'NORMAL';
        else if (days <= frequency * 1.5) alertLevel = 'ATENCION';
        else alertLevel = 'RIESGO';
        return { ...row, deviation: days - frequency, alertLevel };
      });
    });
  }

  topClients(dto: TopClientsFilterDto) {
    const key = `report:top-clients:${dto.startDate ?? ''}:${dto.endDate ?? ''}:${dto.communeId ?? ''}:${dto.companyId ?? ''}:${dto.limit ?? 10}`;
    return this.cached(key, REPORT_TTL, () =>
      this.repo.getTopClients(dto.startDate, dto.endDate, dto.communeId, dto.limit ?? 10, dto.companyId),
    );
  }

  avgPurchaseFrequency(dto: BaseFilterDto) {
    const key = `report:avg-purchase-frequency:${dto.startDate ?? ''}:${dto.endDate ?? ''}:${dto.communeId ?? ''}:${dto.companyId ?? ''}`;
    return this.cached(key, REPORT_TTL, () =>
      this.repo.getAvgPurchaseFrequency(dto.startDate, dto.endDate, dto.communeId, dto.companyId),
    );
  }

  dailyKpis(dto: DailyKpisFilterDto) {
    const key = `report:daily-kpis:${dto.date ?? ''}:${dto.communeId ?? ''}:${dto.companyId ?? ''}`;
    return this.cached(key, DAILY_KPI_TTL, () =>
      this.repo.getDailyKpis(dto.date, dto.communeId, dto.companyId),
    );
  }
}
