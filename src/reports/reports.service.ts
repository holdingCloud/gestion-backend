import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
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

@Injectable()
export class ReportsService {
  constructor(private readonly repo: ReportsRepository) {}

  salesByProduct(dto: SalesByProductFilterDto) {
    return this.repo.getSalesByProduct(dto.startDate, dto.endDate, dto.communeId, dto.period ?? ReportPeriod.DAY, dto.companyId);
  }

  clientPurchasesReport(dto: ClientPurchasesFilterDto) {
    return this.repo.getClientPurchasesReport(
      dto.startDate,
      dto.endDate,
      dto.communeId,
      dto.clientId,
      dto.orderBy ?? ClientReportOrderBy.FREQUENCY,
      dto.companyId,
    );
  }

  salesEvolution(dto: SalesEvolutionFilterDto) {
    return this.repo.getSalesEvolution(dto.startDate, dto.endDate, dto.communeId, dto.period ?? ReportPeriod.DAY, dto.companyId);
  }

  async inactiveClients(dto: BaseFilterDto) {
    const rows = await this.repo.getInactiveClients(dto.communeId, dto.companyId);
    return rows.map((row) => {
      const frequency = Number(row.frequency ?? 0);
      const days = Number(row.daysSinceLastPurchase ?? 0);
      let alertLevel: 'NORMAL' | 'ATENCION' | 'RIESGO';

      if (days <= frequency) {
        alertLevel = 'NORMAL';
      } else if (days <= frequency * 1.5) {
        alertLevel = 'ATENCION';
      } else {
        alertLevel = 'RIESGO';
      }

      return { ...row, deviation: days - frequency, alertLevel };
    });
  }

  topClients(dto: TopClientsFilterDto) {
    return this.repo.getTopClients(dto.startDate, dto.endDate, dto.communeId, dto.limit ?? 10, dto.companyId);
  }

  avgPurchaseFrequency(dto: BaseFilterDto) {
    return this.repo.getAvgPurchaseFrequency(dto.startDate, dto.endDate, dto.communeId, dto.companyId);
  }

  dailyKpis(dto: DailyKpisFilterDto) {
    return this.repo.getDailyKpis(dto.date, dto.communeId, dto.companyId);
  }
}
