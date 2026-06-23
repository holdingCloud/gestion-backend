import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Modulo } from '@prisma/client';

@Injectable()
export class RolModulosRepository {
  private readonly logger = new Logger(RolModulosRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByRol(rolId: number) {
    try {
      return await this.prisma.rolModulo.findMany({
        where: { rolId },
        orderBy: { modulo: 'asc' },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching modulos for rol ${rolId}: ${error.message}`);
      throw error;
    }
  }

  async setModulos(rolId: number, modulos: Modulo[]) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.rolModulo.deleteMany({ where: { rolId } });
        if (modulos.length > 0) {
          await tx.rolModulo.createMany({
            data: modulos.map((modulo) => ({ rolId, modulo })),
          });
        }
        return tx.rolModulo.findMany({ where: { rolId }, orderBy: { modulo: 'asc' } });
      });
    } catch (error: any) {
      this.logger.error(`Error setting modulos for rol ${rolId}: ${error.message}`);
      throw error;
    }
  }

  async addModulo(rolId: number, modulo: Modulo) {
    try {
      return await this.prisma.rolModulo.upsert({
        where: { rolId_modulo: { rolId, modulo } },
        create: { rolId, modulo },
        update: {},
      });
    } catch (error: any) {
      this.logger.error(`Error adding modulo ${modulo} to rol ${rolId}: ${error.message}`);
      throw error;
    }
  }

  async removeModulo(rolId: number, modulo: Modulo) {
    try {
      return await this.prisma.rolModulo.delete({
        where: { rolId_modulo: { rolId, modulo } },
      });
    } catch (error: any) {
      this.logger.error(`Error removing modulo ${modulo} from rol ${rolId}: ${error.message}`);
      throw error;
    }
  }

  async rolHasModulo(rolId: number, modulo: Modulo): Promise<boolean> {
    const record = await this.prisma.rolModulo.findUnique({
      where: { rolId_modulo: { rolId, modulo } },
    });
    return !!record;
  }
}
