import { Injectable, Logger } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { BillRepository } from './bill.repository';
import { BillEntity } from './entities/bill.entity';
import { BillNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class BillService {
  private readonly logger = new Logger(BillService.name);

  constructor(private repo: BillRepository) {}

  async create(createBillDto: CreateBillDto): Promise<BillEntity> {
    try {
      const bill = await this.repo.create(createBillDto);
      this.logger.log(`Bill created successfully with id: ${bill.id}`);
      return new BillEntity(bill);
    } catch (error) {
      this.logger.error(`Failed to create bill: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<BillEntity>> {
    try {
      const { bills, total } = await this.repo.findAll(page, limit);
      const mappedBills = bills.map((bill) => new BillEntity(bill));
      return new PaginatedResponse(mappedBills, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to fetch bills: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<BillEntity> {
    try {
      const bill = await this.repo.findOne(id);
      if (!bill) {
        throw new BillNotFoundException(id);
      }
      return new BillEntity(bill);
    } catch (error) {
      if (error instanceof BillNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch bill with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateBillDto: UpdateBillDto): Promise<BillEntity> {
    try {
      const existingBill = await this.repo.findOne(id);
      if (!existingBill) {
        throw new BillNotFoundException(id);
      }

      const bill = await this.repo.update(id, updateBillDto);
      this.logger.log(`Bill updated successfully with id: ${id}`);
      return new BillEntity(bill);
    } catch (error) {
      if (error instanceof BillNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update bill with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<BillEntity> {
    try {
      const existingBill = await this.repo.findOne(id);
      if (!existingBill) {
        throw new BillNotFoundException(id);
      }

      const bill = await this.repo.remove(id);
      this.logger.log(`Bill deleted successfully with id: ${id}`);
      return new BillEntity(bill);
    } catch (error) {
      if (error instanceof BillNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete bill with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
