import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AusenciasRepository } from './ausencias.repository';
import { CreateVacacionDto } from './dto/create-vacacion.dto';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class AusenciasService {
  private readonly logger = new Logger(AusenciasService.name);

  constructor(private repo: AusenciasRepository) {}

  // ── Vacaciones ──
  async createVacacion(dto: CreateVacacionDto) {
    return this.repo.createVacacion(dto);
  }

  async findVacaciones(employeeId?: number) {
    return this.repo.findVacaciones(employeeId);
  }

  async updateEstadoVacacion(id: number, dto: UpdateEstadoDto) {
    try {
      const record = await this.repo.findOneVacacion(id);
      if (!record) throw new NotFoundException(`Solicitud vacaciones #${id} no encontrada`);
      return await this.repo.updateEstadoVacacion(id, dto.estado);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update vacacion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getSaldoVacaciones(employeeId: number, hireDate: Date) {
    const mesesTrabajados = this.calcMeses(hireDate, new Date());
    const diasDisponibles = Math.floor((mesesTrabajados * 15) / 12);
    const diasUsados = await this.repo.getTotalDiasUsados(employeeId);
    return { diasDisponibles, diasUsados, saldo: diasDisponibles - diasUsados };
  }

  // ── Licencias ──
  async createLicencia(dto: CreateLicenciaDto) {
    return this.repo.createLicencia(dto);
  }

  async findLicencias(employeeId?: number) {
    return this.repo.findLicencias(employeeId);
  }

  async updateEstadoLicencia(id: number, dto: UpdateEstadoDto) {
    try {
      const record = await this.repo.findOneLicencia(id);
      if (!record) throw new NotFoundException(`Licencia médica #${id} no encontrada`);
      return await this.repo.updateEstadoLicencia(id, dto.estado);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update licencia ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ── Permisos ──
  async createPermiso(dto: CreatePermisoDto) {
    return this.repo.createPermiso(dto);
  }

  async findPermisos(employeeId?: number) {
    return this.repo.findPermisos(employeeId);
  }

  async updateEstadoPermiso(id: number, dto: UpdateEstadoDto) {
    try {
      const record = await this.repo.findOnePermiso(id);
      if (!record) throw new NotFoundException(`Permiso #${id} no encontrado`);
      return await this.repo.updateEstadoPermiso(id, dto.estado);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update permiso ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private calcMeses(desde: Date, hasta: Date): number {
    return (
      (hasta.getFullYear() - desde.getFullYear()) * 12 +
      (hasta.getMonth() - desde.getMonth())
    );
  }
}
