import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AfpRepository } from './afp.repository';
import { CreateAfpDto } from './dto/create-afp.dto';
import { UpdateAfpDto } from './dto/update-afp.dto';

@Injectable()
export class AfpService {
  private readonly logger = new Logger(AfpService.name);

  constructor(private repo: AfpRepository) {}

  async create(dto: CreateAfpDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      this.logger.error(`Failed to create AFP: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.repo.findAll();
    } catch (error) {
      this.logger.error(`Failed to fetch AFPs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`AFP #${id} no encontrada`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch AFP ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateAfpDto) {
    try {
      await this.findOne(id);
      return await this.repo.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update AFP ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.repo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete AFP ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
