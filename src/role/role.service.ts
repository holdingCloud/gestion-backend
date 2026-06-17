import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly repo: RoleRepository) {}

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.repo.create(dto);
    return new RoleEntity(role);
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = await this.repo.findAll();
    return roles.map((r) => new RoleEntity(r));
  }

  async findOne(id: number): Promise<RoleEntity> {
    const role = await this.repo.findOne(id);
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return new RoleEntity(role);
  }

  async update(id: number, dto: UpdateRoleDto): Promise<RoleEntity> {
    await this.findOne(id);
    const role = await this.repo.update(id, dto);
    return new RoleEntity(role);
  }

  async remove(id: number): Promise<RoleEntity> {
    await this.findOne(id);
    const role = await this.repo.remove(id);
    return new RoleEntity(role);
  }
}
