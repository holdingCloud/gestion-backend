import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ReportPeriod, ClientReportOrderBy } from './dto/reports-filter.dto';

@Injectable()
export class ReportsRepository {
  private readonly logger = new Logger(ReportsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private buildDateRange(startDate?: string, endDate?: string): { start: Date; end: Date } {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : now;
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  async getSalesByProduct(startDate?: string, endDate?: string, communeId?: number, period: ReportPeriod = ReportPeriod.DAY, companyId?: number) {
    const { start, end } = this.buildDateRange(startDate, endDate);
    const communeFilter  = communeId  ? Prisma.sql`AND c."communeId"  = ${communeId}`  : Prisma.empty;
    const companyFilter  = companyId  ? Prisma.sql`AND c."companyId"  = ${companyId}`  : Prisma.empty;
    const truncUnit = Prisma.raw(`'${period}'`);

    const [byProduct, byPeriod] = await Promise.all([
      this.prisma.$queryRaw<any[]>`
        SELECT
          p.id            AS "productId",
          p.name          AS "productName",
          p.code          AS "productCode",
          COUNT(*)::int   AS "total",
          COUNT(*) FILTER (WHERE b."purchaseStatus" = 'FINALIZADO')::int AS "finalized",
          COUNT(*) FILTER (WHERE b."purchaseStatus" = 'ANULADO')::int    AS "canceled",
          COUNT(*) FILTER (WHERE b."purchaseStatus" = 'PENDIENTE')::int  AS "pending",
          ROUND(
            COUNT(*) FILTER (WHERE b."purchaseStatus" = 'ANULADO')::decimal /
            NULLIF(COUNT(*), 0) * 100, 2
          )::float AS "cancelRate",
          COALESCE(
            SUM(b.quantity * b."unitPrice") FILTER (WHERE b."purchaseStatus" = 'FINALIZADO'),
            0
          )::float AS "totalAmount"
        FROM "buyByClient" b
        JOIN "Products" p ON b."productsId" = p.id
        JOIN "Clients"  c ON b."clientsId"  = c.id
        WHERE b."purchaseDate" BETWEEN ${start} AND ${end}
        ${communeFilter}
        ${companyFilter}
        GROUP BY p.id, p.name, p.code
        ORDER BY "finalized" DESC
      `,
      this.prisma.$queryRaw<any[]>`
        SELECT
          DATE_TRUNC(${truncUnit}, b."purchaseDate") AS "period",
          COUNT(*)::int AS "total",
          COUNT(*) FILTER (WHERE b."purchaseStatus" = 'FINALIZADO')::int AS "finalized",
          COUNT(*) FILTER (WHERE b."purchaseStatus" = 'ANULADO')::int    AS "canceled"
        FROM "buyByClient" b
        JOIN "Clients" c ON b."clientsId" = c.id
        WHERE b."purchaseDate" BETWEEN ${start} AND ${end}
        ${communeFilter}
        ${companyFilter}
        GROUP BY DATE_TRUNC(${truncUnit}, b."purchaseDate")
        ORDER BY "period" ASC
      `,
    ]);

    return { byProduct, byPeriod };
  }

  async getClientPurchasesReport(
    startDate?: string,
    endDate?: string,
    communeId?: number,
    clientId?: number,
    orderBy: ClientReportOrderBy = ClientReportOrderBy.FREQUENCY,
    companyId?: number,
  ) {
    const { start, end } = this.buildDateRange(startDate, endDate);
    const communeFilter = communeId ? Prisma.sql`AND c."communeId" = ${communeId}` : Prisma.empty;
    const clientFilter  = clientId  ? Prisma.sql`AND c.id = ${clientId}`           : Prisma.empty;
    const companyFilter = companyId ? Prisma.sql`AND c."companyId" = ${companyId}` : Prisma.empty;

    const orderMap = {
      [ClientReportOrderBy.FREQUENCY]: Prisma.raw(`"avgDaysBetweenPurchases" ASC NULLS LAST`),
      [ClientReportOrderBy.PURCHASES]: Prisma.raw(`"purchaseCount" DESC`),
      [ClientReportOrderBy.AMOUNT]:    Prisma.raw(`"totalAmount" DESC`),
    };
    const orderClause = orderMap[orderBy];

    return this.prisma.$queryRaw<any[]>`
      SELECT
        c.id          AS "clientId",
        c.fullname    AS "clientName",
        co.name       AS "communeName",
        comp.name     AS "companyName",
        COUNT(b.id) FILTER (WHERE b."purchaseDate" BETWEEN ${start} AND ${end})::int AS "purchaseCount",
        cpf."avgDaysBetweenPurchases",
        COALESCE(
          SUM(b.quantity * b."unitPrice")
            FILTER (WHERE b."purchaseStatus" = 'FINALIZADO' AND b."purchaseDate" BETWEEN ${start} AND ${end}),
          0
        )::float AS "totalAmount"
      FROM "Clients" c
      LEFT JOIN "buyByClient" b ON b."clientsId" = c.id
      LEFT JOIN "Commune" co ON c."communeId" = co.id
      LEFT JOIN "Company" comp ON c."companyId" = comp.id
      LEFT JOIN (
        SELECT "clientsId", ROUND(AVG("avgDaysBetweenPurchases"), 1)::float AS "avgDaysBetweenPurchases"
        FROM "ClientProductFrequency"
        GROUP BY "clientsId"
      ) cpf ON cpf."clientsId" = c.id
      WHERE c.available = true
      ${communeFilter}
      ${clientFilter}
      ${companyFilter}
      GROUP BY c.id, c.fullname, co.name, comp.name, cpf."avgDaysBetweenPurchases"
      ORDER BY ${orderClause}
    `;
  }

  async getSalesEvolution(startDate?: string, endDate?: string, communeId?: number, period: ReportPeriod = ReportPeriod.DAY, companyId?: number) {
    const { start, end } = this.buildDateRange(startDate, endDate);
    const communeFilter = communeId ? Prisma.sql`AND c."communeId" = ${communeId}` : Prisma.empty;
    const companyFilter = companyId ? Prisma.sql`AND c."companyId" = ${companyId}` : Prisma.empty;
    const truncUnit = Prisma.raw(`'${period}'`);

    const series = await this.prisma.$queryRaw<any[]>`
      SELECT
        DATE_TRUNC(${truncUnit}, b."purchaseDate") AS "period",
        COUNT(*) FILTER (WHERE b."purchaseStatus" = 'FINALIZADO')::int AS "transactionCount",
        COALESCE(
          SUM(b.quantity * b."unitPrice") FILTER (WHERE b."purchaseStatus" = 'FINALIZADO'),
          0
        )::float AS "totalAmount"
      FROM "buyByClient" b
      JOIN "Clients" c ON b."clientsId" = c.id
      WHERE b."purchaseDate" BETWEEN ${start} AND ${end}
      ${communeFilter}
      ${companyFilter}
      GROUP BY DATE_TRUNC(${truncUnit}, b."purchaseDate")
      ORDER BY "period" ASC
    `;

    const duration  = end.getTime() - start.getTime();
    const prevEnd   = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);

    const [currTotals, prevTotals] = await Promise.all([
      this.prisma.$queryRaw<{ total: number; txCount: number }[]>`
        SELECT
          COALESCE(SUM(b.quantity * b."unitPrice"), 0)::float AS total,
          COUNT(*)::int AS "txCount"
        FROM "buyByClient" b
        JOIN "Clients" c ON b."clientsId" = c.id
        WHERE b."purchaseStatus" = 'FINALIZADO'
          AND b."purchaseDate" BETWEEN ${start} AND ${end}
        ${communeFilter}
        ${companyFilter}
      `,
      this.prisma.$queryRaw<{ total: number; txCount: number }[]>`
        SELECT
          COALESCE(SUM(b.quantity * b."unitPrice"), 0)::float AS total,
          COUNT(*)::int AS "txCount"
        FROM "buyByClient" b
        JOIN "Clients" c ON b."clientsId" = c.id
        WHERE b."purchaseStatus" = 'FINALIZADO'
          AND b."purchaseDate" BETWEEN ${prevStart} AND ${prevEnd}
        ${communeFilter}
        ${companyFilter}
      `,
    ]);

    const currentTotal    = Number(currTotals[0]?.total   ?? 0);
    const previousTotal   = Number(prevTotals[0]?.total   ?? 0);
    const currentTxCount  = Number(currTotals[0]?.txCount ?? 0);
    const previousTxCount = Number(prevTotals[0]?.txCount ?? 0);

    const variationAmount = previousTotal === 0
      ? null
      : Math.round(((currentTotal - previousTotal) / previousTotal) * 10000) / 100;

    const variationTx = previousTxCount === 0
      ? null
      : Math.round(((currentTxCount - previousTxCount) / previousTxCount) * 10000) / 100;

    return {
      series,
      summary: {
        currentTotal,
        currentTxCount,
        previousTotal,
        previousTxCount,
        variationAmount,
        variationTx,
        previousPeriod: { start: prevStart, end: prevEnd },
      },
    };
  }

  async getInactiveClients(communeId?: number, companyId?: number) {
    const communeFilter = communeId ? Prisma.sql`AND c."communeId" = ${communeId}` : Prisma.empty;
    const companyFilter = companyId ? Prisma.sql`AND c."companyId" = ${companyId}` : Prisma.empty;

    return this.prisma.$queryRaw<any[]>`
      SELECT
        c.id       AS "clientId",
        c.fullname AS "clientName",
        co.name    AS "communeName",
        comp.name  AS "companyName",
        c.frequency,
        MAX(cpf."actualPurchaseDate")                                    AS "lastPurchaseDate",
        ROUND(AVG(cpf."avgDaysBetweenPurchases"), 1)::float             AS "avgDaysBetweenPurchases",
        EXTRACT(DAY FROM NOW() - MAX(cpf."actualPurchaseDate"))::int     AS "daysSinceLastPurchase"
      FROM "Clients" c
      LEFT JOIN "Commune" co ON c."communeId" = co.id
      LEFT JOIN "Company" comp ON c."companyId" = comp.id
      LEFT JOIN "ClientProductFrequency" cpf ON cpf."clientsId" = c.id
      WHERE c.available = true
        AND c.frequency IS NOT NULL
      ${communeFilter}
      ${companyFilter}
      GROUP BY c.id, c.fullname, co.name, comp.name, c.frequency
      HAVING MAX(cpf."actualPurchaseDate") IS NOT NULL
      ORDER BY EXTRACT(DAY FROM NOW() - MAX(cpf."actualPurchaseDate")) DESC NULLS LAST
    `;
  }

  async getTopClients(startDate?: string, endDate?: string, communeId?: number, limit: number = 10, companyId?: number) {
    const { start, end } = this.buildDateRange(startDate, endDate);
    const communeFilter = communeId ? Prisma.sql`AND c."communeId" = ${communeId}` : Prisma.empty;
    const companyFilter = companyId ? Prisma.sql`AND c."companyId" = ${companyId}` : Prisma.empty;

    return this.prisma.$queryRaw<any[]>`
      SELECT
        ROW_NUMBER() OVER (ORDER BY cpf."avgDaysBetweenPurchases" ASC NULLS LAST)::int AS rank,
        c.id       AS "clientId",
        c.fullname AS "clientName",
        co.name    AS "communeName",
        comp.name  AS "companyName",
        cpf."avgDaysBetweenPurchases",
        COALESCE(
          SUM(b.quantity * b."unitPrice") FILTER (WHERE b."purchaseStatus" = 'FINALIZADO'),
          0
        )::float AS "totalAmount",
        COUNT(b.id) FILTER (WHERE b."purchaseStatus" = 'FINALIZADO')::int AS "purchaseCount"
      FROM "Clients" c
      LEFT JOIN "Commune" co ON c."communeId" = co.id
      LEFT JOIN "Company" comp ON c."companyId" = comp.id
      LEFT JOIN (
        SELECT "clientsId", ROUND(AVG("avgDaysBetweenPurchases"), 1)::float AS "avgDaysBetweenPurchases"
        FROM "ClientProductFrequency"
        WHERE "avgDaysBetweenPurchases" IS NOT NULL
        GROUP BY "clientsId"
      ) cpf ON cpf."clientsId" = c.id
      LEFT JOIN "buyByClient" b ON b."clientsId" = c.id
        AND b."purchaseDate" BETWEEN ${start} AND ${end}
      WHERE c.available = true
        AND cpf."avgDaysBetweenPurchases" IS NOT NULL
      ${communeFilter}
      ${companyFilter}
      GROUP BY c.id, c.fullname, co.name, comp.name, cpf."avgDaysBetweenPurchases"
      ORDER BY cpf."avgDaysBetweenPurchases" ASC
      LIMIT ${limit}
    `;
  }

  async getAvgPurchaseFrequency(startDate?: string, endDate?: string, communeId?: number, companyId?: number) {
    const { start, end } = this.buildDateRange(startDate, endDate);
    const communeFilter = communeId ? Prisma.sql`AND c."communeId" = ${communeId}` : Prisma.empty;
    const companyFilter = companyId ? Prisma.sql`AND c."companyId" = ${companyId}` : Prisma.empty;

    const [avgResult, histogram] = await Promise.all([
      this.prisma.$queryRaw<{ globalAvg: number }[]>`
        SELECT ROUND(AVG(cpf."avgDaysBetweenPurchases"), 2)::float AS "globalAvg"
        FROM "ClientProductFrequency" cpf
        JOIN "Clients" c ON cpf."clientsId" = c.id
        WHERE cpf."avgDaysBetweenPurchases" IS NOT NULL
          AND c.available = true
          AND cpf."actualPurchaseDate" BETWEEN ${start} AND ${end}
        ${communeFilter}
        ${companyFilter}
      `,
      this.prisma.$queryRaw<any[]>`
        SELECT
          CASE
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 1  AND 7  THEN '1-7 días'
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 8  AND 14 THEN '8-14 días'
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 15 AND 30 THEN '15-30 días'
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 31 AND 60 THEN '31-60 días'
            ELSE '61+ días'
          END AS range,
          CASE
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 1  AND 7  THEN 1
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 8  AND 14 THEN 8
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 15 AND 30 THEN 15
            WHEN cpf."avgDaysBetweenPurchases" BETWEEN 31 AND 60 THEN 31
            ELSE 61
          END AS "minDays",
          COUNT(DISTINCT cpf."clientsId")::int AS "clientCount"
        FROM "ClientProductFrequency" cpf
        JOIN "Clients" c ON cpf."clientsId" = c.id
        WHERE cpf."avgDaysBetweenPurchases" IS NOT NULL
          AND c.available = true
          AND cpf."actualPurchaseDate" BETWEEN ${start} AND ${end}
        ${communeFilter}
        ${companyFilter}
        GROUP BY 1, 2
        ORDER BY 2
      `,
    ]);

    return {
      globalAvg: Number(avgResult[0]?.globalAvg ?? 0),
      histogram,
    };
  }

  async getDailyKpis(date?: string, communeId?: number, companyId?: number) {
    const target    = date ? new Date(date) : new Date();
    const dayStart  = new Date(target.getFullYear(), target.getMonth(), target.getDate(), 0, 0, 0, 0);
    const dayEnd    = new Date(target.getFullYear(), target.getMonth(), target.getDate(), 23, 59, 59, 999);
    const prevStart = new Date(dayStart.getTime() - 86_400_000);
    const prevEnd   = new Date(dayEnd.getTime()   - 86_400_000);

    const communeFilter = communeId ? Prisma.sql`AND c."communeId" = ${communeId}` : Prisma.empty;
    const companyFilter = companyId ? Prisma.sql`AND c."companyId" = ${companyId}` : Prisma.empty;

    const metricsQuery = (s: Date, e: Date) => this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*) FILTER (WHERE b."purchaseStatus" = 'FINALIZADO')::int AS "finalized",
        COUNT(*) FILTER (WHERE b."purchaseStatus" = 'ANULADO')::int    AS "canceled",
        COALESCE(
          SUM(b.quantity * b."unitPrice") FILTER (WHERE b."purchaseStatus" = 'FINALIZADO'),
          0
        )::float AS "totalAmount",
        CASE
          WHEN COUNT(*) FILTER (WHERE b."purchaseStatus" = 'FINALIZADO') = 0 THEN 0
          ELSE ROUND(
            (SUM(b.quantity * b."unitPrice") FILTER (WHERE b."purchaseStatus" = 'FINALIZADO') /
            COUNT(*) FILTER (WHERE b."purchaseStatus" = 'FINALIZADO'))::numeric,
            2
          )
        END::float AS "avgTicket"
      FROM "buyByClient" b
      JOIN "Clients" c ON b."clientsId" = c.id
      WHERE b."purchaseDate" BETWEEN ${s} AND ${e}
      ${communeFilter}
      ${companyFilter}
    `;

    const newClientsQuery = (s: Date, e: Date) => this.prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM "Clients" c
      WHERE c."createdAt" BETWEEN ${s} AND ${e}
        AND c.available = true
      ${communeFilter}
      ${companyFilter}
    `;

    const [curr, prev, currNew, prevNew] = await Promise.all([
      metricsQuery(dayStart, dayEnd),
      metricsQuery(prevStart, prevEnd),
      newClientsQuery(dayStart, dayEnd),
      newClientsQuery(prevStart, prevEnd),
    ]);

    const c  = curr[0]  ?? { finalized: 0, canceled: 0, totalAmount: 0, avgTicket: 0 };
    const p  = prev[0]  ?? { finalized: 0, canceled: 0, totalAmount: 0, avgTicket: 0 };
    const cn = Number(currNew[0]?.count ?? 0);
    const pn = Number(prevNew[0]?.count ?? 0);

    return {
      date:        dayStart.toISOString().split('T')[0],
      finalized:   Number(c.finalized),
      canceled:    Number(c.canceled),
      totalAmount: Number(c.totalAmount),
      avgTicket:   Number(c.avgTicket),
      newClients:  cn,
      vs: {
        finalized:   Number(c.finalized)   - Number(p.finalized),
        canceled:    Number(c.canceled)    - Number(p.canceled),
        totalAmount: Number(c.totalAmount) - Number(p.totalAmount),
        avgTicket:   Number(c.avgTicket)   - Number(p.avgTicket),
        newClients:  cn - pn,
      },
    };
  }
}
