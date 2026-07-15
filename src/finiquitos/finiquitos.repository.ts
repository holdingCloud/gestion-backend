import { Injectable, Logger } from '@nestjs/common';
import { FiniquitoEstado } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FiniquitosRepository {
  private readonly logger = new Logger(FiniquitosRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.finiquitos.create({
        data,
        include: { employee: { select: { id: true, fullname: true, rut: true } } },
      });
    } catch (error) {
      this.logger.error(`Error creating finiquito: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    try {
      return await this.prisma.finiquitos.findMany({
        where: employeeId ? { employeeId } : undefined,
        include: { employee: { select: { id: true, fullname: true, rut: true } } },
        orderBy: { fechaTermino: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching finiquitos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.finiquitos.findUnique({
        where: { id },
        include: { employee: { select: { id: true, fullname: true, rut: true, hireDate: true, contratos: { where: { estado: 'ACTIVO' } } } } },
      });
    } catch (error) {
      this.logger.error(`Error fetching finiquito ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEstado(id: number, estado: FiniquitoEstado) {
    try {
      return await this.prisma.finiquitos.update({ where: { id }, data: { estado } });
    } catch (error) {
      this.logger.error(`Error updating finiquito ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getContratoActivo(employeeId: number) {
    try {
      return await this.prisma.contratos.findFirst({
        where: { employeeId, estado: 'ACTIVO' },
        orderBy: { fechaInicio: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching contrato activo for ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getEmployee(employeeId: number) {
    try {
      return await this.prisma.employees.findUnique({
        where: { id: employeeId },
        select: { id: true, fullname: true, rut: true, hireDate: true },
      });
    } catch (error) {
      this.logger.error(`Error fetching employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
