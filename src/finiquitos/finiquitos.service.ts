import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FiniquitosRepository } from './finiquitos.repository';
import { CreateFiniquitoDto } from './dto/create-finiquito.dto';
import { UpdateEstadoFiniquitoDto } from './dto/update-estado-finiquito.dto';

@Injectable()
export class FiniquitosService {
  private readonly logger = new Logger(FiniquitosService.name);

  constructor(private repo: FiniquitosRepository) {}

  async create(dto: CreateFiniquitoDto) {
    try {
      const employee = await this.repo.getEmployee(dto.employeeId);
      if (!employee) throw new NotFoundException(`Empleado #${dto.employeeId} no encontrado`);

      const contrato = await this.repo.getContratoActivo(dto.employeeId);
      if (!contrato) throw new BadRequestException(`Empleado #${dto.employeeId} no tiene contrato activo`);

      const sueldoBase = Number(contrato.sueldoBase);
      const sueldoDiario = sueldoBase / 30;
      const fechaTermino = new Date(dto.fechaTermino);

      // Feriado proporcional: días trabajados en el año × (15/365) × sueldo diario
      const inicioAno = new Date(fechaTermino.getFullYear(), 0, 1);
      const diasTrabajadosAno = Math.floor(
        (fechaTermino.getTime() - inicioAno.getTime()) / (1000 * 60 * 60 * 24),
      );
      const feriadoProporcional = Math.round((diasTrabajadosAno / 365) * 15 * sueldoDiario);

      // Indemnización: solo Art.161, 1 mes por año, tope 11 meses
      let indemnizacion = 0;
      if (dto.causal === 'ART_161') {
        const anosServicio = Math.min(
          Math.floor(
            (fechaTermino.getTime() - new Date(employee.hireDate).getTime()) /
              (1000 * 60 * 60 * 24 * 365),
          ),
          11,
        );
        indemnizacion = anosServicio * sueldoBase;
      }

      const totalFiniquito = feriadoProporcional + indemnizacion;

      return await this.repo.create({
        employee: { connect: { id: dto.employeeId } },
        causal: dto.causal,
        fechaTermino: new Date(dto.fechaTermino),
        feriadoProporcional: feriadoProporcional as any,
        indemnizacion: indemnizacion as any,
        totalFiniquito: totalFiniquito as any,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      this.logger.error(`Failed to create finiquito: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    return this.repo.findAll(employeeId);
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`Finiquito #${id} no encontrado`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch finiquito ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEstado(id: number, dto: UpdateEstadoFiniquitoDto) {
    try {
      await this.findOne(id);
      return await this.repo.updateEstado(id, dto.estado);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update finiquito ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
