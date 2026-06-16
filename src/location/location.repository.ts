import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationRepository {
  private readonly logger = new Logger(LocationRepository.name);

  constructor(private prisma: PrismaService) {}

  async findAllRegions() {
    try {
      return await this.prisma.region.findMany({
        select: { id: true, name: true },
        orderBy: { id: 'asc' },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching regions: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findRegionById(id: number) {
    try {
      return await this.prisma.region.findUnique({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Error fetching region ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findCommunesByRegion(regionId: number) {
    try {
      return await this.prisma.commune.findMany({
        where: { regionId },
        select: { id: true, name: true, regionId: true },
        orderBy: { name: 'asc' },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching communes for region ${regionId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
