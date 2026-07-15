import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAfpDto } from './dto/create-afp.dto';
import { UpdateAfpDto } from './dto/update-afp.dto';

@Injectable()
export class AfpRepository {
  private readonly logger = new Logger(AfpRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateAfpDto) {
    try {
      return await this.prisma.aFP.create({ data: data as any });
    } catch (error) {
      this.logger.error(`Error creating AFP: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.aFP.findMany({ orderBy: { nombre: 'asc' } });
    } catch (error) {
      this.logger.error(`Error fetching AFPs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.aFP.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching AFP ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateAfpDto) {
    try {
      return await this.prisma.aFP.update({ where: { id }, data: data as any });
    } catch (error) {
      this.logger.error(`Error updating AFP ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.aFP.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting AFP ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
