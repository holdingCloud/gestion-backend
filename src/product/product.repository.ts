import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { ProductAlreadyExistsException } from './exceptions';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    try {
      return await this.prisma.products.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ProductAlreadyExistsException(data.code);
        }
      }
      this.logger.error(`Error creating product: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [products, total] = await Promise.all([
        this.prisma.products.findMany({
          where: { available: true },
          skip,
          take: limit,
        }),
        this.prisma.products.count({ where: { available: true } }),
      ]);

      return { products, total };
    } catch (error) {
      this.logger.error(`Error fetching products: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.products.findUnique({ where: { id, available: true } });
    } catch (error) {
      this.logger.error(
        `Error fetching product with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, data: UpdateProductDto) {
    try {
      return await this.prisma.products.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ProductAlreadyExistsException(data.code || 'code');
        }
      }
      this.logger.error(
        `Error updating product with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.products.update({
        where: { id },
        data: { available: false },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting product with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
