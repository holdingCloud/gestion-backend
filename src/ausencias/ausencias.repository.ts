import { Injectable, Logger } from '@nestjs/common';
import { EstadoSolicitud } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVacacionDto } from './dto/create-vacacion.dto';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { CreatePermisoDto } from './dto/create-permiso.dto';

@Injectable()
export class AusenciasRepository {
  private readonly logger = new Logger(AusenciasRepository.name);

  constructor(private prisma: PrismaService) {}

  // ── Vacaciones ──
  async createVacacion(data: CreateVacacionDto) {
    try {
      return await this.prisma.solicitudesVacaciones.create({ data: data as any });
    } catch (error) {
      this.logger.error(`Error creating vacacion: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findVacaciones(employeeId?: number) {
    try {
      return await this.prisma.solicitudesVacaciones.findMany({
        where: employeeId ? { employeeId } : undefined,
        include: { employee: { select: { id: true, fullname: true, rut: true } } },
        orderBy: { fechaInicio: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching vacaciones: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOneVacacion(id: number) {
    try {
      return await this.prisma.solicitudesVacaciones.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching vacacion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEstadoVacacion(id: number, estado: EstadoSolicitud) {
    try {
      return await this.prisma.solicitudesVacaciones.update({ where: { id }, data: { estado } });
    } catch (error) {
      this.logger.error(`Error updating vacacion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTotalDiasUsados(employeeId: number) {
    try {
      const result = await this.prisma.solicitudesVacaciones.aggregate({
        where: { employeeId, estado: 'APROBADA' },
        _sum: { diasHabiles: true },
      });
      return result._sum.diasHabiles ?? 0;
    } catch (error) {
      this.logger.error(`Error getting dias usados for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ── Licencias ──
  async createLicencia(data: CreateLicenciaDto) {
    try {
      return await this.prisma.licenciasMedicas.create({ data: data as any });
    } catch (error) {
      this.logger.error(`Error creating licencia: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findLicencias(employeeId?: number) {
    try {
      return await this.prisma.licenciasMedicas.findMany({
        where: employeeId ? { employeeId } : undefined,
        include: { employee: { select: { id: true, fullname: true, rut: true } } },
        orderBy: { fechaInicio: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching licencias: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOneLicencia(id: number) {
    try {
      return await this.prisma.licenciasMedicas.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching licencia ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEstadoLicencia(id: number, estado: EstadoSolicitud) {
    try {
      return await this.prisma.licenciasMedicas.update({ where: { id }, data: { estado } });
    } catch (error) {
      this.logger.error(`Error updating licencia ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ── Permisos ──
  async createPermiso(data: CreatePermisoDto) {
    try {
      return await this.prisma.permisos.create({ data: data as any });
    } catch (error) {
      this.logger.error(`Error creating permiso: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findPermisos(employeeId?: number) {
    try {
      return await this.prisma.permisos.findMany({
        where: employeeId ? { employeeId } : undefined,
        include: { employee: { select: { id: true, fullname: true, rut: true } } },
        orderBy: { fechaInicio: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching permisos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOnePermiso(id: number) {
    try {
      return await this.prisma.permisos.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching permiso ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEstadoPermiso(id: number, estado: EstadoSolicitud) {
    try {
      return await this.prisma.permisos.update({ where: { id }, data: { estado } });
    } catch (error) {
      this.logger.error(`Error updating permiso ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
