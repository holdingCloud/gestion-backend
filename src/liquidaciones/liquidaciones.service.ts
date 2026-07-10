import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LiquidacionesRepository } from './liquidaciones.repository';
import { ContratosRepository } from 'src/contratos/contratos.repository';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateEstadoLiquidacionDto } from './dto/update-estado-liquidacion.dto';
import { CreateTipoItemDto } from './dto/create-tipo-item.dto';
import { Decimal } from '@prisma/client/runtime/library';

// IMM 2024: $500.000 CLP — actualizar cuando cambie
const IMM = 500000;
const TASA_SALUD = 0.07;
const TASA_AFC_INDEFINIDO = 0.006;
const TOPE_GRATIFICACION_ART50 = 4.75 * IMM;

@Injectable()
export class LiquidacionesService {
  private readonly logger = new Logger(LiquidacionesService.name);

  constructor(
    private repo: LiquidacionesRepository,
    private contratosRepo: ContratosRepository,
  ) {}

  async create(dto: CreateLiquidacionDto) {
    try {
      const contrato = await this.contratosRepo.findActiveByEmployee(dto.employeeId);
      if (!contrato) throw new BadRequestException(`Empleado #${dto.employeeId} no tiene contrato activo`);

      const sueldoBase = Number(contrato.sueldoBase);
      const afpTasa = contrato.employee?.afp ? Number((contrato.employee as any).afp.tasaCotizacion) : 0.1;

      // Calcular haberes
      let gratificacion = 0;
      if (contrato.gratificacion === 'ART_50') {
        gratificacion = Math.min(sueldoBase * 0.25, TOPE_GRATIFICACION_ART50 / 12);
      }
      const totalHaberes = sueldoBase + gratificacion;

      // Calcular descuentos legales
      const baseImponible = totalHaberes;
      const descuentoAfp = baseImponible * afpTasa;
      const descuentoSalud = baseImponible * TASA_SALUD;
      const descuentoAfc = contrato.tipoContrato === 'INDEFINIDO' ? baseImponible * TASA_AFC_INDEFINIDO : 0;

      // Anticipos del periodo
      const anticipos = await this.repo.findAnticiposPendientes(dto.employeeId, dto.periodo);
      const totalAnticipos = anticipos.reduce((acc, a) => acc + Number(a.monto), 0);

      const totalDescuentos = descuentoAfp + descuentoSalud + descuentoAfc + totalAnticipos;
      const liquidoAPagar = totalHaberes - totalDescuentos;

      // Buscar tipos de items legales para registrar
      const tiposItems = await this.repo.findAllTiposItem();
      const tipoSueldo = tiposItems.find((t) => t.nombre.toLowerCase().includes('sueldo') && t.tipo === 'HABER');
      const tipoAfp = tiposItems.find((t) => t.nombre.toLowerCase().includes('afp') && t.tipo === 'DESCUENTO');
      const tipoSalud = tiposItems.find((t) => t.nombre.toLowerCase().includes('salud') && t.tipo === 'DESCUENTO');
      const tipoAfc = tiposItems.find((t) => t.nombre.toLowerCase().includes('afc') && t.tipo === 'DESCUENTO');

      const itemsData: { tipoItemId: number; monto: number }[] = [];
      if (tipoSueldo) itemsData.push({ tipoItemId: tipoSueldo.id, monto: sueldoBase });
      if (tipoAfp) itemsData.push({ tipoItemId: tipoAfp.id, monto: descuentoAfp });
      if (tipoSalud) itemsData.push({ tipoItemId: tipoSalud.id, monto: descuentoSalud });
      if (tipoAfc && descuentoAfc > 0) itemsData.push({ tipoItemId: tipoAfc.id, monto: descuentoAfc });

      const liquidacion = await this.repo.create({
        employee: { connect: { id: dto.employeeId } },
        periodo: new Date(dto.periodo) as any,
        sueldoBase: sueldoBase as any,
        totalHaberes: totalHaberes as any,
        totalDescuentos: totalDescuentos as any,
        liquidoAPagar: liquidoAPagar as any,
        items: {
          create: itemsData.map((i) => ({
            tipoItem: { connect: { id: i.tipoItemId } },
            monto: i.monto as any,
          })),
        },
        libroRemuneraciones: {
          create: {
            periodo: new Date(dto.periodo) as any,
            employee: { connect: { id: dto.employeeId } },
            totalImponible: baseImponible as any,
            liquido: liquidoAPagar as any,
          },
        },
      } as any);

      // Marcar anticipos como descontados
      if (anticipos.length > 0) {
        await Promise.all(
          anticipos.map((a) =>
            this.repo['prisma'].anticipos.update({ where: { id: a.id }, data: { descontado: true } }),
          ),
        );
      }

      return liquidacion;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`Failed to create liquidacion: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    try {
      return await this.repo.findAll(employeeId);
    } catch (error) {
      this.logger.error(`Failed to fetch liquidaciones: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`Liquidación #${id} no encontrada`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch liquidacion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEstado(id: number, dto: UpdateEstadoLiquidacionDto) {
    try {
      await this.findOne(id);
      return await this.repo.updateEstado(id, dto.estado);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update estado liquidacion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getLibroPorPeriodo(periodo: string) {
    try {
      return await this.repo.findLibroPorPeriodo(periodo);
    } catch (error) {
      this.logger.error(`Failed to fetch libro for periodo ${periodo}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createTipoItem(dto: CreateTipoItemDto) {
    try {
      return await this.repo.createTipoItem(dto);
    } catch (error) {
      this.logger.error(`Failed to create tipo item: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllTiposItem() {
    try {
      return await this.repo.findAllTiposItem();
    } catch (error) {
      this.logger.error(`Failed to fetch tipos item: ${error.message}`, error.stack);
      throw error;
    }
  }
}
