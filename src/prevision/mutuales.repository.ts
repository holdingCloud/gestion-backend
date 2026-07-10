import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMutualDto } from './dto/create-mutual.dto';
import { UpdateMutualDto } from './dto/update-mutual.dto';

@Injectable()
export class MutualesRepository {
  private readonly logger = new Logger(MutualesRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateMutualDto) {
    try {
      return await this.prisma.mutuales.create({ data });
    } catch (error) {
      this.logger.error(`Error creating mutual: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.mutuales.findMany({ orderBy: { nombre: 'asc' } });
    } catch (error) {
      this.logger.error(`Error fetching mutuales: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.mutuales.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching mutual ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateMutualDto) {
    try {
      return await this.prisma.mutuales.update({ where: { id }, data });
    } catch (error) {
      this.logger.error(`Error updating mutual ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.mutuales.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting mutual ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
