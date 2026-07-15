import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CargosRepository } from './cargos.repository';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

@Injectable()
export class CargosService {
  private readonly logger = new Logger(CargosService.name);

  constructor(private repo: CargosRepository) {}

  async create(dto: CreateCargoDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      this.logger.error(`Failed to create cargo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(departamentoId?: number) {
    try {
      return await this.repo.findAll(departamentoId);
    } catch (error) {
      this.logger.error(`Failed to fetch cargos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`Cargo #${id} no encontrado`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch cargo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateCargoDto) {
    try {
      await this.findOne(id);
      return await this.repo.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update cargo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.repo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete cargo ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
