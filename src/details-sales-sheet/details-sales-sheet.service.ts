import { Injectable, Logger } from '@nestjs/common';
import { CreateDetailsSalesSheetDto } from './dto/create-details-sales-sheet.dto';
import { UpdateDetailsSalesSheetDto } from './dto/update-details-sales-sheet.dto';
import { DetailsSalesSheetRepository } from './details-sales-sheet.repository';
import { DetailsSalesSheetEntity } from './entities/details-sales-sheet.entity';
import { DetailsSalesSheetNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class DetailsSalesSheetService {
  private readonly logger = new Logger(DetailsSalesSheetService.name);

  constructor(private repo: DetailsSalesSheetRepository) {}

  async create(
    createDetailsSalesSheetDto: CreateDetailsSalesSheetDto,
  ): Promise<DetailsSalesSheetEntity> {
    try {
      const detailsSalesSheet = await this.repo.create(createDetailsSalesSheetDto);
      this.logger.log(
        `Details sales sheet created successfully with id: ${detailsSalesSheet.id}`,
      );
      return new DetailsSalesSheetEntity(detailsSalesSheet);
    } catch (error) {
      this.logger.error(
        `Failed to create details sales sheet: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<DetailsSalesSheetEntity>> {
    try {
      const { detailsSalesSheets, total } = await this.repo.findAll(page, limit);
      const mappedDetailsSalesSheets = detailsSalesSheets.map(
        (item) => new DetailsSalesSheetEntity(item),
      );
      return new PaginatedResponse(mappedDetailsSalesSheets, total, page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch details sales sheets: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<DetailsSalesSheetEntity> {
    try {
      const detailsSalesSheet = await this.repo.findOne(id);
      if (!detailsSalesSheet) {
        throw new DetailsSalesSheetNotFoundException(id);
      }
      return new DetailsSalesSheetEntity(detailsSalesSheet);
    } catch (error) {
      if (error instanceof DetailsSalesSheetNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch details sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: number,
    updateDetailsSalesSheetDto: UpdateDetailsSalesSheetDto,
  ): Promise<DetailsSalesSheetEntity> {
    try {
      const existingDetailsSalesSheet = await this.repo.findOne(id);
      if (!existingDetailsSalesSheet) {
        throw new DetailsSalesSheetNotFoundException(id);
      }

      const detailsSalesSheet = await this.repo.update(id, updateDetailsSalesSheetDto);
      this.logger.log(`Details sales sheet updated successfully with id: ${id}`);
      return new DetailsSalesSheetEntity(detailsSalesSheet);
    } catch (error) {
      if (error instanceof DetailsSalesSheetNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update details sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<DetailsSalesSheetEntity> {
    try {
      const existingDetailsSalesSheet = await this.repo.findOne(id);
      if (!existingDetailsSalesSheet) {
        throw new DetailsSalesSheetNotFoundException(id);
      }

      const detailsSalesSheet = await this.repo.remove(id);
      this.logger.log(`Details sales sheet deleted successfully with id: ${id}`);
      return new DetailsSalesSheetEntity(detailsSalesSheet);
    } catch (error) {
      if (error instanceof DetailsSalesSheetNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete details sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
