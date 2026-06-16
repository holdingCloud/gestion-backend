import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { RegionEntity } from './entities/region.entity';
import { CommuneEntity } from './entities/commune.entity';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private repo: LocationRepository) {}

  async findAllRegions(): Promise<RegionEntity[]> {
    try {
      const regions = await this.repo.findAllRegions();
      return regions.map((r) => new RegionEntity(r));
    } catch (error: any) {
      this.logger.error(`Failed to fetch regions: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findCommunesByRegion(regionId: number): Promise<CommuneEntity[]> {
    try {
      const region = await this.repo.findRegionById(regionId);
      if (!region) throw new NotFoundException(`Región con id ${regionId} no encontrada`);
      const communes = await this.repo.findCommunesByRegion(regionId);
      return communes.map((c) => new CommuneEntity(c));
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch communes for region ${regionId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
