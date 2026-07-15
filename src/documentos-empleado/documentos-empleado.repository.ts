import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { CreateCargaFamiliarDto } from './dto/create-carga-familiar.dto';

@Injectable()
export class DocumentosEmpleadoRepository {
  private readonly logger = new Logger(DocumentosEmpleadoRepository.name);

  constructor(private prisma: PrismaService) {}

  // ── Documentos ──
  async createDocumento(data: CreateDocumentoDto) {
    try {
      return await this.prisma.documentosEmpleado.create({ data });
    } catch (error) {
      this.logger.error(`Error creating documento: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findDocumentos(employeeId: number) {
    try {
      return await this.prisma.documentosEmpleado.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching documentos for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeDocumento(id: number) {
    try {
      return await this.prisma.documentosEmpleado.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting documento ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ── Cuentas Bancarias ──
  async createCuenta(data: CreateCuentaBancariaDto) {
    try {
      return await this.prisma.cuentasBancariasEmpleado.create({ data });
    } catch (error) {
      this.logger.error(`Error creating cuenta bancaria: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findCuentas(employeeId: number) {
    try {
      return await this.prisma.cuentasBancariasEmpleado.findMany({
        where: { employeeId },
        orderBy: [{ esPrincipal: 'desc' }, { createdAt: 'desc' }],
      });
    } catch (error) {
      this.logger.error(`Error fetching cuentas for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeCuenta(id: number) {
    try {
      return await this.prisma.cuentasBancariasEmpleado.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting cuenta ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ── Cargas Familiares ──
  async createCarga(data: CreateCargaFamiliarDto) {
    try {
      return await this.prisma.cargasFamiliares.create({ data: data as any });
    } catch (error) {
      this.logger.error(`Error creating carga familiar: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findCargas(employeeId: number) {
    try {
      return await this.prisma.cargasFamiliares.findMany({
        where: { employeeId },
        orderBy: { nombre: 'asc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching cargas for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeCarga(id: number) {
    try {
      return await this.prisma.cargasFamiliares.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting carga ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
