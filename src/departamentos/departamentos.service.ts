import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DepartamentosRepository } from './departamentos.repository';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { DepartamentoEntity } from './entities/departamento.entity';

@Injectable()
export class DepartamentosService {
  private readonly logger = new Logger(DepartamentosService.name);

  constructor(private repo: DepartamentosRepository) {}

  async create(dto: CreateDepartamentoDto) {
    try {
      const result = await this.repo.create(dto);
      return new DepartamentoEntity(result);
    } catch (error) {
      this.logger.error(`Failed to create departamento: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(`Failed to fetch departamentos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`Departamento #${id} no encontrado`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch departamento ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateDepartamentoDto) {
    try {
      await this.findOne(id);
      const result = await this.repo.update(id, dto);
      return new DepartamentoEntity(result);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update departamento ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.repo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete departamento ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
