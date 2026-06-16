import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyRepository {
  private readonly logger = new Logger(CompanyRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({ data });
    } catch (error: any) {
      this.logger.error(`Error creating company: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.company.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { clients: true } } },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching companies: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.company.findUnique({
        where: { id },
        include: { _count: { select: { clients: true } } },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching company ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateCompanyDto) {
    try {
      return await this.prisma.company.update({ where: { id }, data });
    } catch (error: any) {
      this.logger.error(`Error updating company ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.company.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Error deleting company ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
