import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { CreateAnexoDto } from './dto/create-anexo.dto';

const contratoInclude = {
  employee: { select: { id: true, fullname: true, rut: true } },
  anexos: true,
} as const;

@Injectable()
export class ContratosRepository {
  private readonly logger = new Logger(ContratosRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateContratoDto) {
    try {
      const { sueldoBase, ...rest } = data;
      return await this.prisma.contratos.create({
        data: { ...rest, sueldoBase: sueldoBase as any },
        include: contratoInclude,
      });
    } catch (error) {
      this.logger.error(`Error creating contrato: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    try {
      return await this.prisma.contratos.findMany({
        where: employeeId ? { employeeId } : undefined,
        include: contratoInclude,
        orderBy: { fechaInicio: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching contratos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.contratos.findUnique({
        where: { id },
        include: contratoInclude,
      });
    } catch (error) {
      this.logger.error(`Error fetching contrato ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findActiveByEmployee(employeeId: number) {
    try {
      return await this.prisma.contratos.findFirst({
        where: { employeeId, estado: 'ACTIVO' },
        include: { employee: { select: { id: true, fullname: true, rut: true, afp: true, sistemasSalud: true } } },
        orderBy: { fechaInicio: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching active contrato for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateContratoDto) {
    try {
      const { sueldoBase, ...rest } = data;
      return await this.prisma.contratos.update({
        where: { id },
        data: { ...rest, ...(sueldoBase !== undefined ? { sueldoBase: sueldoBase as any } : {}) },
        include: contratoInclude,
      });
    } catch (error) {
      this.logger.error(`Error updating contrato ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createAnexo(data: CreateAnexoDto) {
    try {
      return await this.prisma.anexosContrato.create({ data });
    } catch (error) {
      this.logger.error(`Error creating anexo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAnexosByContrato(contratoId: number) {
    try {
      return await this.prisma.anexosContrato.findMany({
        where: { contratoId },
        orderBy: { fechaVigencia: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching anexos for contrato ${contratoId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
