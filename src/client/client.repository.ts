import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma, ContactStatus, PurchaseStatus, FrequencyStatus } from '@prisma/client';
import { ClientAlreadyExistsException } from './exceptions';

const clientInclude = {
  company: { select: { id: true, name: true, description: true } },
  direccion: { include: { commune: { select: { id: true, name: true, regionId: true } } } },
  clientProductFrequencies: {
    include: { product: { select: { id: true, name: true, code: true } } },
    orderBy: { actualPurchaseDate: 'desc' as const },
  },
} as any;

const clientIncludeLight = {
  company: { select: { id: true, name: true, description: true } },
  direccion: { include: { commune: { select: { id: true, name: true, regionId: true } } } },
} as any;

@Injectable()
export class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);

  constructor(private prisma: PrismaService) {}

  // ─── Clients ────────────────────────────────────────────────────────────────

  async create(data: CreateClientDto) {
    try {
      const { direccionPrincipal, ...clientData } = data;
      return await this.prisma.$transaction(async (tx) => {
        let direccionId: number | undefined;
        if (direccionPrincipal) {
          const dir = await tx.direcciones.create({
            data: { ...direccionPrincipal, tipo: 'PRINCIPAL' },
          });
          direccionId = dir.id;
        }
        const client = await tx.clients.create({
          data: { ...clientData, available: true, ...(direccionId ? { direccionId } : {}) } as any,
        });
        return tx.clients.findUnique({ where: { id: client.id }, include: clientInclude });
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[])?.join(', ') ?? 'campo desconocido';
        this.logger.error(`P2002 unique constraint violated on: ${target}`);
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
    companyId?: number,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = { available: true };
      if (contactStatus) where.contactStatus = contactStatus;
      if (companyId) where.companyId = companyId;
      if (search) where.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { direccion: { calle: { contains: search, mode: 'insensitive' } } },
      ];
      if (communeId) where.direccion = { communeId };
      if (regionId) where.direccion = { commune: { regionId } };
      const [clients, total] = await Promise.all([
        this.prisma.clients.findMany({ where, skip, take: limit, include: clientIncludeLight }),
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
      return await this.prisma.clients.findUnique({ where: { id }, include: clientInclude });
    } catch (error: any) {
      this.logger.error(`Error fetching client with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateClientDto) {
    try {
      const { direccionPrincipal, ...clientData } = data;
      return await this.prisma.$transaction(async (tx) => {
        const currentClient = await tx.clients.findUnique({ where: { id }, select: { direccionId: true } as any }) as any;
        if (direccionPrincipal) {
          if (currentClient?.direccionId) {
            await tx.direcciones.update({ where: { id: currentClient.direccionId }, data: direccionPrincipal });
          } else {
            const dir = await tx.direcciones.create({ data: { ...direccionPrincipal, tipo: 'PRINCIPAL' } });
            (clientData as any).direccionId = dir.id;
          }
        }
        await tx.clients.update({ where: { id }, data: clientData as any });
        return tx.clients.findUnique({ where: { id }, include: clientInclude });
      });
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
