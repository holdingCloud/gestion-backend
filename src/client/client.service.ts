import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/update-purchase-status.dto';
import { ClientEntity } from './entities/client.entity';
import { PurchaseEntity } from './entities/purchase.entity';
import { ClientProductFrequencyEntity } from './entities/client-product-frequency.entity';
import { ClientNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';
import { ContactStatus, PurchaseStatus } from '@prisma/client';
import { FrequencyStatus } from './enums/frequency-status.enum';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private repo: ClientRepository) {}

  // ─── Clients ────────────────────────────────────────────────────────────────

  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    try {
      const client = await this.repo.create(createClientDto);
      this.logger.log(`Client created with id: ${client!.id}`);
      return new ClientEntity({ ...client! });
    } catch (error: any) {
      this.logger.error(`Failed to create client: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    contactStatus?: ContactStatus,
    search?: string,
    communeId?: number,
    regionId?: number,
  ): Promise<PaginatedResponse<ClientEntity>> {
    try {
      const { clients, total } = await this.repo.findAll(page, limit, contactStatus, search, communeId, regionId);
      const refreshed = await Promise.all(clients.map((c) => this.refreshClientStatus(c)));
      return new PaginatedResponse(
        refreshed.map((c) => this.buildClientEntity(c)),
        total,
        page,
        limit,
      );
    } catch (error: any) {
      this.logger.error(`Failed to fetch clients: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<ClientEntity> {
    try {
      const client = await this.repo.findOne(id);
      if (!client) throw new ClientNotFoundException(id);
      const refreshed = await this.refreshClientStatus(client);
      return this.buildClientEntity(refreshed);
    } catch (error: any) {
      if (error instanceof ClientNotFoundException) throw error;
      this.logger.error(`Failed to fetch client ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    try {
      const existing = await this.repo.findOne(id);
      if (!existing) throw new ClientNotFoundException(id);
      const client = await this.repo.update(id, updateClientDto);
      return new ClientEntity({ ...client! });
    } catch (error: any) {
      if (error instanceof ClientNotFoundException) throw error;
      this.logger.error(`Failed to update client ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateContactStatus(id: number, dto: UpdateContactStatusDto): Promise<ClientEntity> {
    try {
      const existing = await this.repo.findOne(id);
      if (!existing) throw new ClientNotFoundException(id);
      const client = await this.repo.updateContactStatus(id, dto.contactStatus);
      return new ClientEntity({ ...client });
    } catch (error: any) {
      if (error instanceof ClientNotFoundException) throw error;
      this.logger.error(`Failed to update contact status for client ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<ClientEntity> {
    try {
      const existing = await this.repo.findOne(id);
      if (!existing) throw new ClientNotFoundException(id);
      const client = await this.repo.remove(id);
      return new ClientEntity({ ...client });
    } catch (error: any) {
      if (error instanceof ClientNotFoundException) throw error;
      this.logger.error(`Failed to delete client ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ─── Purchases ──────────────────────────────────────────────────────────────

  async registerPurchase(clientId: number, dto: CreatePurchaseDto): Promise<PurchaseEntity> {
    try {
      const existing = await this.repo.findOne(clientId);
      if (!existing) throw new ClientNotFoundException(clientId);

      const purchase = await this.repo.createPurchase(
        clientId,
        dto.productsId,
        dto.quantity,
        dto.unitPrice,
        new Date(dto.purchaseDate),
      );

      this.logger.log(`Purchase created (PENDIENTE) for client ${clientId}, product ${dto.productsId}`);
      return new PurchaseEntity({ ...purchase, product: (purchase as any).product });
    } catch (error: any) {
      if (error instanceof ClientNotFoundException) throw error;
      this.logger.error(`Failed to register purchase for client ${clientId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updatePurchaseStatus(clientId: number, purchaseId: number, dto: UpdatePurchaseStatusDto): Promise<PurchaseEntity> {
    try {
      const client = await this.repo.findOne(clientId);
      if (!client) throw new ClientNotFoundException(clientId);

      const purchase = await this.repo.findPurchaseById(purchaseId);
      if (!purchase || purchase.clientsId !== clientId) {
        throw new NotFoundException(`Compra ${purchaseId} no encontrada para el cliente ${clientId}`);
      }

      if (purchase.purchaseStatus !== PurchaseStatus.PENDIENTE) {
        throw new NotFoundException(`La compra ${purchaseId} ya fue ${purchase.purchaseStatus}`);
      }

      const updated = await this.repo.updatePurchaseStatus(purchaseId, dto.purchaseStatus);

      if (dto.purchaseStatus === PurchaseStatus.FINALIZADO) {
        await this.applyFinalizePurchase(clientId, purchase);
      }

      this.logger.log(`Purchase ${purchaseId} → ${dto.purchaseStatus} for client ${clientId}`);
      return new PurchaseEntity({ ...updated, product: (updated as any).product });
    } catch (error: any) {
      if (error instanceof ClientNotFoundException || error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update purchase status ${purchaseId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getClientPurchases(
    clientId: number,
    page: number = 1,
    limit: number = 5,
    productsId?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PaginatedResponse<PurchaseEntity>> {
    try {
      const existing = await this.repo.findOne(clientId);
      if (!existing) throw new ClientNotFoundException(clientId);
      const { purchases, total } = await this.repo.findPurchasesByClient(clientId, page, limit, productsId, startDate, endDate);
      return new PaginatedResponse(
        purchases.map((p) => new PurchaseEntity({ ...p, product: (p as any).product })),
        total,
        page,
        limit,
      );
    } catch (error: any) {
      if (error instanceof ClientNotFoundException) throw error;
      this.logger.error(`Failed to fetch purchases for client ${clientId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getClientFrequency(clientId: number): Promise<ClientProductFrequencyEntity[]> {
    try {
      const existing = await this.repo.findOne(clientId);
      if (!existing) throw new ClientNotFoundException(clientId);
      const frequencies = await this.repo.findFrequencyByClient(clientId);
      return frequencies.map((f: any) => this.buildFrequencyEntity(f));
    } catch (error: any) {
      if (error instanceof ClientNotFoundException) throw error;
      this.logger.error(`Failed to fetch frequency for client ${clientId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async applyFinalizePurchase(clientId: number, purchase: any): Promise<void> {
    const { productsId, purchaseDate } = purchase;
    const actualPurchaseDate = new Date(purchaseDate);

    const existing = await this.repo.findFrequencyByClientProduct(clientId, productsId);

    let lastPurchaseDate: Date | null = null;
    let avgDaysBetweenPurchases: number | null = null;
    let nextEstimatedDate: Date | null = null;
    let purchaseCount = 1;
    let status = FrequencyStatus.NUEVO;

    if (existing && existing.actualPurchaseDate) {
      lastPurchaseDate = new Date(existing.actualPurchaseDate);
      purchaseCount = (existing.purchaseCount || 0) + 1;

      const diffDays = Math.round(
        (actualPurchaseDate.getTime() - lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      avgDaysBetweenPurchases = Math.max(diffDays, 1);
      nextEstimatedDate = new Date(actualPurchaseDate.getTime() + avgDaysBetweenPurchases * 24 * 60 * 60 * 1000);
      status = FrequencyStatus.EN_PLAZO;
    }

    await this.repo.upsertFrequency(clientId, productsId, {
      purchaseCount,
      avgDaysBetweenPurchases,
      lastPurchaseDate,
      actualPurchaseDate,
      nextEstimatedDate,
      status,
    });

    if (avgDaysBetweenPurchases !== null) {
      await this.repo.updateClientFrequency(clientId, avgDaysBetweenPurchases);
    }

    await this.repo.updateContactStatus(clientId, ContactStatus.CONTACTADO);
  }

  private async refreshClientStatus(client: any): Promise<any> {
    const avg: number | null = client.frequency ?? null;
    if (!avg) return client;

    const frequencies: any[] = client.clientProductFrequencies ?? [];
    const latest = frequencies
      .filter((f) => f.actualPurchaseDate)
      .sort((a, b) => new Date(b.actualPurchaseDate).getTime() - new Date(a.actualPurchaseDate).getTime())[0];

    if (!latest) return client;

    const daysSince = Math.floor(
      (Date.now() - new Date(latest.actualPurchaseDate).getTime()) / (1000 * 60 * 60 * 24),
    );

    let newStatus: ContactStatus = client.contactStatus;

    if (daysSince > avg) {
      newStatus = ContactStatus.VENCIDO;
    } else if (avg - daysSince <= 3 && client.contactStatus === ContactStatus.CONTACTADO) {
      newStatus = ContactStatus.LLAMAR;
    }

    if (newStatus !== client.contactStatus) {
      await this.repo.updateContactStatus(client.id, newStatus);
      return { ...client, contactStatus: newStatus };
    }

    return client;
  }

  private buildClientEntity(client: any): ClientEntity {
    const frequencies = (client.clientProductFrequencies ?? []).map((f: any) => this.buildFrequencyEntity(f));
    return new ClientEntity({ ...client, frequencies });
  }

  private buildFrequencyEntity(freq: any): ClientProductFrequencyEntity {
    const daysSinceLastPurchase = freq.actualPurchaseDate
      ? Math.floor((Date.now() - new Date(freq.actualPurchaseDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    return new ClientProductFrequencyEntity({ ...freq, daysSinceLastPurchase });
  }
}
