import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolModulosRepository } from './rol-modulos.repository';
import { AssignModulosDto } from './dto/assign-modulos.dto';
import { Modulo } from '@prisma/client';

@Injectable()
export class RolModulosService {
  constructor(
    private readonly repo: RolModulosRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getModulosByRol(rolId: number) {
    await this.ensureRolExists(rolId);
    const records = await this.repo.findByRol(rolId);
    return records.map((r) => r.modulo);
  }

  async setModulos(rolId: number, dto: AssignModulosDto) {
    await this.ensureRolExists(rolId);
    const records = await this.repo.setModulos(rolId, dto.modulos);
    return records.map((r) => r.modulo);
  }

  async addModulo(rolId: number, modulo: Modulo) {
    await this.ensureRolExists(rolId);
    return this.repo.addModulo(rolId, modulo);
  }

  async removeModulo(rolId: number, modulo: Modulo) {
    await this.ensureRolExists(rolId);
    return this.repo.removeModulo(rolId, modulo);
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
