import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ReportsControllerDocs,
  SalesByProductDocs,
  ClientPurchasesReportDocs,
  SalesEvolutionDocs,
  InactiveClientsDocs,
  TopClientsDocs,
  AvgPurchaseFrequencyDocs,
  DailyKpisDocs,
} from 'src/docs/swagger/reports.docs';
import {
  BaseFilterDto,
  ClientPurchasesFilterDto,
  DailyKpisFilterDto,
  SalesByProductFilterDto,
  SalesEvolutionFilterDto,
  TopClientsFilterDto,
} from './dto/reports-filter.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
@ReportsControllerDocs()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-by-product')
  @HttpCode(HttpStatus.OK)
  @SalesByProductDocs()
  salesByProduct(@Query() dto: SalesByProductFilterDto) {
    return this.reportsService.salesByProduct(dto);
  }

  @Get('clients-purchases')
  @HttpCode(HttpStatus.OK)
  @ClientPurchasesReportDocs()
  clientPurchasesReport(@Query() dto: ClientPurchasesFilterDto) {
    return this.reportsService.clientPurchasesReport(dto);
  }

  @Get('sales-evolution')
  @HttpCode(HttpStatus.OK)
  @SalesEvolutionDocs()
  salesEvolution(@Query() dto: SalesEvolutionFilterDto) {
    return this.reportsService.salesEvolution(dto);
  }

  @Get('inactive-clients')
  @HttpCode(HttpStatus.OK)
  @InactiveClientsDocs()
  inactiveClients(@Query() dto: BaseFilterDto) {
    return this.reportsService.inactiveClients(dto);
  }

  @Get('top-clients')
  @HttpCode(HttpStatus.OK)
  @TopClientsDocs()
  topClients(@Query() dto: TopClientsFilterDto) {
    return this.reportsService.topClients(dto);
  }

  @Get('avg-purchase-frequency')
  @HttpCode(HttpStatus.OK)
  @AvgPurchaseFrequencyDocs()
  avgPurchaseFrequency(@Query() dto: BaseFilterDto) {
    return this.reportsService.avgPurchaseFrequency(dto);
  }

  @Get('daily-kpis')
  @HttpCode(HttpStatus.OK)
  @DailyKpisDocs()
  dailyKpis(@Query() dto: DailyKpisFilterDto) {
    return this.reportsService.dailyKpis(dto);
  }
}
