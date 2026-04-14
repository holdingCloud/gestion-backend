import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSalesSheetDto } from './dto/create-sales-sheet.dto';
import { UpdateSalesSheetDto } from './dto/update-sales-sheet.dto';

@Injectable()
export class SalesSheetRepository {
  private readonly logger = new Logger(SalesSheetRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateSalesSheetDto) {
    try {
      return await this.prisma.salesSheets.create({
        data: {
          ...data,
          date: new Date(data.date),
        },
      });
    } catch (error) {
      this.logger.error(`Error creating sales sheet: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [salesSheets, total] = await Promise.all([
        this.prisma.salesSheets.findMany({
          skip,
          take: limit,
          orderBy: { id: 'desc' },
        }),
        this.prisma.salesSheets.count(),
      ]);

      return { salesSheets, total };
    } catch (error) {
      this.logger.error(`Error fetching sales sheets: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.salesSheets.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error fetching sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, data: UpdateSalesSheetDto) {
    try {
      const payload = {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      };

      return await this.prisma.salesSheets.update({
        where: { id },
        data: payload,
      });
    } catch (error) {
      this.logger.error(
        `Error updating sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.salesSheets.delete({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error deleting sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
