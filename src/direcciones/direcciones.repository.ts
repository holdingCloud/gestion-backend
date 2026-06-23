import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { TiposDireccion } from '@prisma/client';

const COMMUNE_SELECT = { id: true, name: true, regionId: true };

@Injectable()
export class DireccionesRepository {
  private readonly logger = new Logger(DireccionesRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateDireccionDto) {
    try {
      return await this.prisma.direcciones.create({
        data,
        include: { commune: { select: COMMUNE_SELECT } },
      });
    } catch (error: any) {
      this.logger.error(`Error creating direccion: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(filters: { tipo?: TiposDireccion }) {
    try {
      const where: any = {};
      if (filters.tipo) where.tipo = filters.tipo;

      return await this.prisma.direcciones.findMany({
        where,
        include: { commune: { select: COMMUNE_SELECT } },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching direcciones: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const direccion = await this.prisma.direcciones.findUnique({
        where: { id },
        include: { commune: { select: COMMUNE_SELECT } },
      });
      if (!direccion) throw new NotFoundException(`Dirección con id ${id} no encontrada`);
      return direccion;
    } catch (error: any) {
      this.logger.error(`Error fetching direccion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateDireccionDto) {
    try {
      return await this.prisma.direcciones.update({
        where: { id },
        data,
        include: { commune: { select: COMMUNE_SELECT } },
      });
    } catch (error: any) {
      this.logger.error(`Error updating direccion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.direcciones.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Error deleting direccion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
