import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnticipoDto } from './dto/create-anticipo.dto';

@Injectable()
export class AnticiposRepository {
  private readonly logger = new Logger(AnticiposRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateAnticipoDto) {
    try {
      return await this.prisma.anticipos.create({ data: data as any });
    } catch (error) {
      this.logger.error(`Error creating anticipo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    try {
      return await this.prisma.anticipos.findMany({
        where: employeeId ? { employeeId } : undefined,
        include: { employee: { select: { id: true, fullname: true, rut: true } } },
        orderBy: { fecha: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching anticipos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findPendientes(employeeId: number) {
    try {
      return await this.prisma.anticipos.findMany({
        where: { employeeId, descontado: false },
        orderBy: { fecha: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching anticipos pendientes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.anticipos.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error fetching anticipo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.anticipos.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error deleting anticipo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
