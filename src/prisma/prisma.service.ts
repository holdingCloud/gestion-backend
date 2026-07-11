import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const baseUrl = process.env.DATABASE_URL ?? '';
    const separator = baseUrl.includes('?') ? '&' : '?';
    super({
      log: [],
      datasources: {
        db: {
          url: `${baseUrl}${separator}connection_limit=5&pool_timeout=20`,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}