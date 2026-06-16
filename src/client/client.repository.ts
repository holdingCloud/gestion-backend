import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma, ContactStatus, PurchaseStatus, FrequencyStatus } from '@prisma/client';
import { ClientAlreadyExistsException } from './exceptions';

@Injectable()
export class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);

  constructor(private prisma: PrismaService) {}

  // ─── Clients ────────────────────────────────────────────────────────────────

  async create(data: CreateClientDto) {
    try {
      return await this.prisma.clients.create({ data: { ...data, available: true } as any });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ClientAlreadyExistsException(data.email);
      }
      this.logger.error(`Error creating client: ${error.message}`, error.stack);
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
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.ClientsWhereInput = { available: true };
      if (contactStatus) where.contactStatus = contactStatus;
      if (search) where.fullname = { contains: search, mode: 'insensitive' };
      if (communeId) where.communeId = communeId;
      if (regionId) where.commune = { regionId };
      const [clients, total] = await Promise.all([
        this.prisma.clients.findMany({
          where,
          skip,
          take: limit,
          include: {
            commune: { select: { id: true, name: true, regionId: true } },
            company: { select: { id: true, name: true, description: true } },
            clientProductFrequencies: {
              include: { product: { select: { id: true, name: true, code: true } } },
              orderBy: { actualPurchaseDate: 'desc' },
            },
          },
        }),
        this.prisma.clients.count({ where }),
      ]);
      return { clients, total };
    } catch (error: any) {
      this.logger.error(`Error fetching clients: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.clients.findUnique({
        where: { id },
        include: {
          commune: { select: { id: true, name: true, regionId: true } },
          company: { select: { id: true, name: true, description: true } },
          clientProductFrequencies: {
            include: { product: { select: { id: true, name: true, code: true } } },
            orderBy: { actualPurchaseDate: 'desc' },
          },
        },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching client with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateClientDto) {
    try {
      return await this.prisma.clients.update({ where: { id }, data: data as any });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ClientAlreadyExistsException(data.email || 'email');
      }
      this.logger.error(`Error updating client with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateContactStatus(id: number, contactStatus: ContactStatus) {
    try {
      return await this.prisma.clients.update({ where: { id }, data: { contactStatus } });
    } catch (error: any) {
      this.logger.error(`Error updating contact status for client ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateClientFrequency(id: number, frequency: number) {
    try {
      return await this.prisma.clients.update({ where: { id }, data: { frequency } });
    } catch (error: any) {
      this.logger.error(`Error updating frequency for client ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.clients.update({ where: { id }, data: { available: false } });
    } catch (error: any) {
      this.logger.error(`Error deleting client with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ─── Purchases ──────────────────────────────────────────────────────────────

  async createPurchase(clientsId: number, productsId: number, quantity: number, unitPrice: number, purchaseDate: Date) {
    try {
      return await this.prisma.buyByClient.create({
        data: { clientsId, productsId, quantity, unitPrice, purchaseDate },
        include: { product: { select: { id: true, name: true, code: true } } },
      });
    } catch (error: any) {
      this.logger.error(`Error creating purchase: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findPurchaseById(id: number) {
    try {
      return await this.prisma.buyByClient.findUnique({
        where: { id },
        include: { product: { select: { id: true, name: true, code: true } } },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching purchase ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findPurchasesByClient(
    clientsId: number,
    page: number = 1,
    limit: number = 5,
    productsId?: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.buyByClientWhereInput = { clientsId };
      if (productsId) where.productsId = productsId;
      if (startDate || endDate) {
        where.purchaseDate = {};
        if (startDate) (where.purchaseDate as any).gte = startDate;
        if (endDate) (where.purchaseDate as any).lte = endDate;
      }
      const [purchases, total] = await Promise.all([
        this.prisma.buyByClient.findMany({
          where,
          skip,
          take: limit,
          orderBy: { purchaseDate: 'desc' },
          include: { product: { select: { id: true, name: true, code: true } } },
        }),
        this.prisma.buyByClient.count({ where }),
      ]);
      return { purchases, total };
    } catch (error: any) {
      this.logger.error(`Error fetching purchases for client ${clientsId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updatePurchaseStatus(id: number, purchaseStatus: PurchaseStatus) {
    try {
      return await this.prisma.buyByClient.update({
        where: { id },
        data: { purchaseStatus },
        include: { product: { select: { id: true, name: true, code: true } } },
      });
    } catch (error: any) {
      this.logger.error(`Error updating purchase status ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ─── Frequency ──────────────────────────────────────────────────────────────

  async findFrequencyByClientProduct(clientsId: number, productsId: number) {
    try {
      return await (this.prisma as any).clientProductFrequency.findUnique({
        where: { clientsId_productsId: { clientsId, productsId } },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching frequency for client ${clientsId} product ${productsId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findFrequencyByClient(clientsId: number) {
    try {
      return await (this.prisma as any).clientProductFrequency.findMany({
        where: { clientsId },
        include: { product: { select: { id: true, name: true, code: true } } },
        orderBy: { actualPurchaseDate: 'desc' },
      });
    } catch (error: any) {
      this.logger.error(`Error fetching frequency for client ${clientsId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async upsertFrequency(
    clientsId: number,
    productsId: number,
    data: {
      purchaseCount: number;
      avgDaysBetweenPurchases: number | null;
      lastPurchaseDate: Date | null;
      actualPurchaseDate: Date;
      nextEstimatedDate: Date | null;
      status: FrequencyStatus;
    },
  ) {
    try {
      return await (this.prisma as any).clientProductFrequency.upsert({
        where: { clientsId_productsId: { clientsId, productsId } },
        create: { clientsId, productsId, ...data },
        update: data,
      });
    } catch (error: any) {
      this.logger.error(`Error upserting frequency: ${error.message}`, error.stack);
      throw error;
    }
  }
}
