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
          // Limita el pool a 2 conexiones para no saturar el pooler de Supabase (límite: 15)
          url: `${baseUrl}${separator}connection_limit=2&pool_timeout=10`,
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