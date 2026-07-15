import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSistemaSaludDto } from './dto/create-sistema-salud.dto';
import { UpdateSistemaSaludDto } from './dto/update-sistema-salud.dto';

@Injectable()
export class SistemasSaludRepository {
  private readonly logger = new Logger(SistemasSaludRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateSistemaSaludDto) {
    try {
      return await this.prisma.sistemasSalud.create({ data });
    } catch (error) {
      this.logger.error(`Error creating sistema salud: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.sistemasSalud.findMany({ orderBy: { nombre: 'asc' } });
    } catch (error) {
      this.logger.error(`Error fetching sistemas salud: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.sistemasSalud.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching sistema salud ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateSistemaSaludDto) {
    try {
      return await this.prisma.sistemasSalud.update({ where: { id }, data });
    } catch (error) {
      this.logger.error(`Error updating sistema salud ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.sistemasSalud.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting sistema salud ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
