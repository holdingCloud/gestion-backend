import { Injectable, Logger } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEntity } from './entities/client.entity';
import { ClientNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private repo: ClientRepository) {}

  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    try {
      const client = await this.repo.create(createClientDto);
      this.logger.log(`Client created successfully with id: ${client.id}`);
      return new ClientEntity({
        ...client,
        available: client.available ?? undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to create client: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<ClientEntity>> {
    try {
      const { clients, total } = await this.repo.findAll(page, limit);
      const mappedClients = clients.map((client) =>
        new ClientEntity({
          ...client,
          available: client.available ?? undefined,
        }),
      );
      return new PaginatedResponse(mappedClients, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to fetch clients: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<ClientEntity> {
    try {
      const client = await this.repo.findOne(id);
      if (!client) {
        throw new ClientNotFoundException(id);
      }
      return new ClientEntity({
        ...client,
        available: client.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof ClientNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch client with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    try {
      const existingClient = await this.repo.findOne(id);
      if (!existingClient) {
        throw new ClientNotFoundException(id);
      }

      const client = await this.repo.update(id, updateClientDto);
      this.logger.log(`Client updated successfully with id: ${id}`);
      return new ClientEntity({
        ...client,
        available: client.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof ClientNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update client with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<ClientEntity> {
    try {
      const existingClient = await this.repo.findOne(id);
      if (!existingClient) {
        throw new ClientNotFoundException(id);
      }

      const client = await this.repo.remove(id);
      this.logger.log(`Client deleted successfully with id: ${id}`);
      return new ClientEntity({
        ...client,
        available: client.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof ClientNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete client with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
