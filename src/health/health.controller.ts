import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { HealthControllerDocs, HealthCheckDocs, DatabaseHealthCheckDocs } from 'src/docs/swagger/health.docs';

@Controller('healthcheck')
@HealthControllerDocs()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get('database')
  @HealthCheck()
  @DatabaseHealthCheckDocs()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }

  @Get()
  @HealthCheckDocs()
  healthCheck(){
    return {status: 'ok',
    message: 'Health check successful',
    timestamp: new Date().toISOString(),}
  }
}
