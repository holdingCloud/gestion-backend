import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AnticiposRepository } from './anticipos.repository';
import { CreateAnticipoDto } from './dto/create-anticipo.dto';

@Injectable()
export class AnticiposService {
  private readonly logger = new Logger(AnticiposService.name);

  constructor(private repo: AnticiposRepository) {}

  async create(dto: CreateAnticipoDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      this.logger.error(`Failed to create anticipo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    return this.repo.findAll(employeeId);
  }

  async findPendientes(employeeId: number) {
    return this.repo.findPendientes(employeeId);
  }

  async remove(id: number) {
    try {
      const record = await this.repo.findOne(id);
      if (!record) throw new NotFoundException(`Anticipo #${id} no encontrado`);
      return await this.repo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete anticipo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
