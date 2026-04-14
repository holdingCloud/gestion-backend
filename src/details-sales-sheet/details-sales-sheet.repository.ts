import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDetailsSalesSheetDto } from './dto/create-details-sales-sheet.dto';
import { UpdateDetailsSalesSheetDto } from './dto/update-details-sales-sheet.dto';

@Injectable()
export class DetailsSalesSheetRepository {
  private readonly logger = new Logger(DetailsSalesSheetRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateDetailsSalesSheetDto) {
    try {
      return await this.prisma.detailsSalesSheet.create({ data });
    } catch (error) {
      this.logger.error(
        `Error creating details sales sheet: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [detailsSalesSheets, total] = await Promise.all([
        this.prisma.detailsSalesSheet.findMany({
          skip,
          take: limit,
          orderBy: { id: 'desc' },
        }),
        this.prisma.detailsSalesSheet.count(),
      ]);

      return { detailsSalesSheets, total };
    } catch (error) {
      this.logger.error(
        `Error fetching details sales sheets: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.detailsSalesSheet.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error fetching details sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, data: UpdateDetailsSalesSheetDto) {
    try {
      return await this.prisma.detailsSalesSheet.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(
        `Error updating details sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.detailsSalesSheet.delete({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error deleting details sales sheet with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
