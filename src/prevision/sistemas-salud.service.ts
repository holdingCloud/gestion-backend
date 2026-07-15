import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SistemasSaludRepository } from './sistemas-salud.repository';
import { CreateSistemaSaludDto } from './dto/create-sistema-salud.dto';
import { UpdateSistemaSaludDto } from './dto/update-sistema-salud.dto';

@Injectable()
export class SistemasSaludService {
  private readonly logger = new Logger(SistemasSaludService.name);

  constructor(private repo: SistemasSaludRepository) {}

  async create(dto: CreateSistemaSaludDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      this.logger.error(`Failed to create sistema salud: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(`Failed to fetch sistemas salud: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`Sistema de Salud #${id} no encontrado`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch sistema salud ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateSistemaSaludDto) {
    try {
      await this.findOne(id);
      return await this.repo.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update sistema salud ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.repo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete sistema salud ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
