import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ContratosRepository } from './contratos.repository';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { CreateAnexoDto } from './dto/create-anexo.dto';

@Injectable()
export class ContratosService {
  private readonly logger = new Logger(ContratosService.name);

  constructor(private repo: ContratosRepository) {}

  async create(dto: CreateContratoDto) {
    try {
      return await this.repo.create(dto);
    } catch (error) {
      this.logger.error(`Failed to create contrato: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(employeeId?: number) {
    try {
      return await this.repo.findAll(employeeId);
    } catch (error) {
      this.logger.error(`Failed to fetch contratos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.repo.findOne(id);
      if (!result) throw new NotFoundException(`Contrato #${id} no encontrado`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch contrato ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateContratoDto) {
    try {
      await this.findOne(id);
      return await this.repo.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update contrato ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addAnexo(contratoId: number, dto: CreateAnexoDto) {
    try {
      await this.findOne(contratoId);
      return await this.repo.createAnexo({ ...dto, contratoId });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to add anexo to contrato ${contratoId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAnexos(contratoId: number) {
    try {
      await this.findOne(contratoId);
      return await this.repo.findAnexosByContrato(contratoId);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch anexos for contrato ${contratoId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
