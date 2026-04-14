import { Injectable, Logger } from '@nestjs/common';
import { CreateBillDetailsDto } from './dto/create-bill-details.dto';
import { UpdateBillDetailsDto } from './dto/update-bill-details.dto';
import { BillDetailsRepository } from './bill-details.repository';
import { BillDetailsEntity } from './entities/bill-details.entity';
import { BillDetailsNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class BillDetailsService {
  private readonly logger = new Logger(BillDetailsService.name);

  constructor(private repo: BillDetailsRepository) {}

  async create(createBillDetailsDto: CreateBillDetailsDto): Promise<BillDetailsEntity> {
    try {
      const billDetails = await this.repo.create(createBillDetailsDto);
      this.logger.log(`Bill details created successfully with id: ${billDetails.id}`);
      return new BillDetailsEntity(billDetails);
    } catch (error) {
      this.logger.error(`Failed to create bill details: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<BillDetailsEntity>> {
    try {
      const { billDetails, total } = await this.repo.findAll(page, limit);
      const mappedBillDetails = billDetails.map((detail) => new BillDetailsEntity(detail));
      return new PaginatedResponse(mappedBillDetails, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to fetch bill details: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<BillDetailsEntity> {
    try {
      const billDetails = await this.repo.findOne(id);
      if (!billDetails) {
        throw new BillDetailsNotFoundException(id);
      }
      return new BillDetailsEntity(billDetails);
    } catch (error) {
      if (error instanceof BillDetailsNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch bill details with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, updateBillDetailsDto: UpdateBillDetailsDto): Promise<BillDetailsEntity> {
    try {
      const existingBillDetails = await this.repo.findOne(id);
      if (!existingBillDetails) {
        throw new BillDetailsNotFoundException(id);
      }

      const billDetails = await this.repo.update(id, updateBillDetailsDto);
      this.logger.log(`Bill details updated successfully with id: ${id}`);
      return new BillDetailsEntity(billDetails);
    } catch (error) {
      if (error instanceof BillDetailsNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update bill details with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<BillDetailsEntity> {
    try {
      const existingBillDetails = await this.repo.findOne(id);
      if (!existingBillDetails) {
        throw new BillDetailsNotFoundException(id);
      }

      const billDetails = await this.repo.remove(id);
      this.logger.log(`Bill details deleted successfully with id: ${id}`);
      return new BillDetailsEntity(billDetails);
    } catch (error) {
      if (error instanceof BillDetailsNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete bill details with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
