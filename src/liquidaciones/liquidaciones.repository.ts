import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LiquidacionEstado, Prisma } from '@prisma/client';
import { CreateTipoItemDto } from './dto/create-tipo-item.dto';

const liquidacionInclude = {
  employee: { select: { id: true, fullname: true, rut: true } },
  items: { include: { tipoItem: true } },
} as const;

@Injectable()
export class LiquidacionesRepository {
  private readonly logger = new Logger(LiquidacionesRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LiquidacionesCreateInput) {
    try {
      return await this.prisma.liquidaciones.create({
        data,
        include: liquidacionInclude,
      });
    } catch (error) {
      this.logger.error(`Error creating liquidacion: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    try {
      return await this.prisma.liquidaciones.findMany({
        where: employeeId ? { employeeId } : undefined,
        include: liquidacionInclude,
        orderBy: { periodo: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching liquidaciones: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.liquidaciones.findUnique({
        where: { id },
        include: liquidacionInclude,
      });
    } catch (error) {
      this.logger.error(`Error fetching liquidacion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEstado(id: number, estado: LiquidacionEstado) {
    try {
      return await this.prisma.liquidaciones.update({
        where: { id },
        data: { estado },
        include: liquidacionInclude,
      });
    } catch (error) {
      this.logger.error(`Error updating estado liquidacion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findLibroPorPeriodo(periodo: string) {
    try {
      return await this.prisma.libroRemuneraciones.findMany({
        where: { periodo: new Date(periodo) },
        include: {
          employee: { select: { id: true, fullname: true, rut: true } },
          liquidacion: true,
        },
        orderBy: { employee: { fullname: 'asc' } },
      });
    } catch (error) {
      this.logger.error(`Error fetching libro for periodo ${periodo}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createTipoItem(data: CreateTipoItemDto) {
    try {
      return await this.prisma.tiposItemLiquidacion.create({ data });
    } catch (error) {
      this.logger.error(`Error creating tipo item: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllTiposItem() {
    try {
      return await this.prisma.tiposItemLiquidacion.findMany({ orderBy: { nombre: 'asc' } });
    } catch (error) {
      this.logger.error(`Error fetching tipos item: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAnticiposPendientes(employeeId: number, periodo: string) {
    try {
      const periodoDate = new Date(periodo);
      const inicio = new Date(periodoDate.getFullYear(), periodoDate.getMonth(), 1);
      const fin = new Date(periodoDate.getFullYear(), periodoDate.getMonth() + 1, 0);
      return await this.prisma.anticipos.findMany({
        where: { employeeId, descontado: false, fecha: { gte: inicio, lte: fin } },
      });
    } catch (error) {
      this.logger.error(`Error fetching anticipos: ${error.message}`, error.stack);
      throw error;
    }
  }
}
