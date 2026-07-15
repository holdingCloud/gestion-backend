import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentosRepository {
  private readonly logger = new Logger(DepartamentosRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateDepartamentoDto) {
    try {
      return await this.prisma.departamentos.create({ data });
    } catch (error) {
      this.logger.error(`Error creating departamento: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.departamentos.findMany({
        include: { cargos: true },
        orderBy: { nombre: 'asc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching departamentos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.departamentos.findUnique({
        where: { id },
        include: { cargos: true },
      });
    } catch (error) {
      this.logger.error(`Error fetching departamento ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateDepartamentoDto) {
    try {
      return await this.prisma.departamentos.update({ where: { id }, data });
    } catch (error) {
      this.logger.error(`Error updating departamento ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.departamentos.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting departamento ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
