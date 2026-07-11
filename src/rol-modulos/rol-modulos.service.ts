import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolModulosRepository } from './rol-modulos.repository';
import { AssignModulosDto } from './dto/assign-modulos.dto';
import { Modulo } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RolModulosService {
  constructor(
    private readonly repo: RolModulosRepository,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getModulosByRol(rolId: number) {
    await this.ensureRolExists(rolId);
    const records = await this.repo.findByRol(rolId);
    return records.map((r) => r.modulo);
  }

  async setModulos(rolId: number, dto: AssignModulosDto) {
    await this.ensureRolExists(rolId);
    const records = await this.repo.setModulos(rolId, dto.modulos);
    await this.redis.delByPattern('session:*');
    return records.map((r) => r.modulo);
  }

  async addModulo(rolId: number, modulo: Modulo) {
    await this.ensureRolExists(rolId);
    const result = await this.repo.addModulo(rolId, modulo);
    await this.redis.delByPattern('session:*');
    return result;
  }

  async removeModulo(rolId: number, modulo: Modulo) {
    await this.ensureRolExists(rolId);
    const result = await this.repo.removeModulo(rolId, modulo);
    await this.redis.delByPattern('session:*');
    return result;
  }

  async getAllRolesWithModulos() {
    return this.prisma.roles.findMany({
      include: {
        modulos: { orderBy: { modulo: 'asc' } },
      },
    });
  }

  private async ensureRolExists(rolId: number) {
    const rol = await this.prisma.roles.findUnique({ where: { id: rolId } });
    if (!rol) throw new NotFoundException(`Rol con id ${rolId} no encontrado`);
    return rol;
  }
}
