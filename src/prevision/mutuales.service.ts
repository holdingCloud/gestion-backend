import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MutualesRepository } from './mutuales.repository';
import { CreateMutualDto } from './dto/create-mutual.dto';
import { UpdateMutualDto } from './dto/update-mutual.dto';

@Injectable()
export class MutualesService {
  private readonly logger = new Logger(MutualesService.name);

  constructor(private repo: MutualesRepository) {}

  async create(dto: CreateMutualDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      this.logger.error(`Failed to create mutual: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(`Failed to fetch mutuales: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`Mutual #${id} no encontrada`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch mutual ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateMutualDto) {
    try {
      await this.findOne(id);
      return await this.repo.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update mutual ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.repo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete mutual ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
