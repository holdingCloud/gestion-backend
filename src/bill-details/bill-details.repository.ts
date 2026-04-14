import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBillDetailsDto } from './dto/create-bill-details.dto';
import { UpdateBillDetailsDto } from './dto/update-bill-details.dto';

@Injectable()
export class BillDetailsRepository {
  private readonly logger = new Logger(BillDetailsRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateBillDetailsDto) {
    try {
      return await this.prisma.billDetails.create({
        data: {
          ...data,
          date: new Date(data.date),
        },
      });
    } catch (error) {
      this.logger.error(`Error creating bill details: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [billDetails, total] = await Promise.all([
        this.prisma.billDetails.findMany({
          skip,
          take: limit,
          orderBy: { id: 'desc' },
        }),
        this.prisma.billDetails.count(),
      ]);

      return { billDetails, total };
    } catch (error) {
      this.logger.error(`Error fetching bill details: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.billDetails.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error fetching bill details with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, data: UpdateBillDetailsDto) {
    try {
      const payload = {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      };

      return await this.prisma.billDetails.update({
        where: { id },
        data: payload,
      });
    } catch (error) {
      this.logger.error(
        `Error updating bill details with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.billDetails.delete({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error deleting bill details with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
