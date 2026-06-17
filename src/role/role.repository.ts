import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleRepository {
  private readonly logger = new Logger(RoleRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDto) {
    try {
      return await this.prisma.roles.create({ data });
    } catch (error: any) {
      this.logger.error(`Error creating role: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.roles.findMany({
        orderBy: { type: 'asc' },
        include: { _count: { select: { user: true } } },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching roles: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.roles.findUnique({
        where: { id },
        include: { _count: { select: { user: true } } },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching role ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateRoleDto) {
    try {
      return await this.prisma.roles.update({ where: { id }, data });
    } catch (error: any) {
      this.logger.error(`Error updating role ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.roles.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Error deleting role ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
