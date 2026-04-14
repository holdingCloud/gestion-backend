import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillRepository {
  private readonly logger = new Logger(BillRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateBillDto) {
    try {
      return await this.prisma.bills.create({ data });
    } catch (error) {
      this.logger.error(`Error creating bill: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [bills, total] = await Promise.all([
        this.prisma.bills.findMany({
          skip,
          take: limit,
          orderBy: { id: 'desc' },
        }),
        this.prisma.bills.count(),
      ]);

      return { bills, total };
    } catch (error) {
      this.logger.error(`Error fetching bills: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.bills.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching bill with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateBillDto) {
    try {
      return await this.prisma.bills.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(`Error updating bill with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.bills.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting bill with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
