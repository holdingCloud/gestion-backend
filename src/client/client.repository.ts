import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma } from '@prisma/client';
import { ClientAlreadyExistsException } from './exceptions';

@Injectable()
export class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    try {
      return await this.prisma.clients.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ClientAlreadyExistsException(data.email);
        }
      }
      this.logger.error(`Error creating client: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [clients, total] = await Promise.all([
        this.prisma.clients.findMany({
          where: { available: true },
          skip,
          take: limit,
        }),
        this.prisma.clients.count({ where: { available: true } }),
      ]);
      return { clients, total };
    } catch (error) {
      this.logger.error(`Error fetching clients: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.clients.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error fetching client with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, data: UpdateClientDto) {
    try {
      return await this.prisma.clients.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ClientAlreadyExistsException(data.email || 'email');
        }
      }
      this.logger.error(
        `Error updating client with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.clients.update({
        where: { id },
        data: {
          available: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting client with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
