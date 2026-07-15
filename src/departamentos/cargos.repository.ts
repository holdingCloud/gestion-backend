import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

@Injectable()
export class CargosRepository {
  private readonly logger = new Logger(CargosRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateCargoDto) {
    try {
      return await this.prisma.cargos.create({
        data,
        include: { departamento: true },
      });
    } catch (error) {
      this.logger.error(`Error creating cargo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(departamentoId?: number) {
    try {
      return await this.prisma.cargos.findMany({
        where: departamentoId ? { departamentoId } : undefined,
        include: { departamento: true },
        orderBy: { nombre: 'asc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching cargos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.cargos.findUnique({
        where: { id },
        include: { departamento: true },
      });
    } catch (error) {
      this.logger.error(`Error fetching cargo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateCargoDto) {
    try {
      return await this.prisma.cargos.update({
        where: { id },
        data,
        include: { departamento: true },
      });
    } catch (error) {
      this.logger.error(`Error updating cargo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.cargos.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting cargo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
