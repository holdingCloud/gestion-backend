import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private repo: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = await this.repo.create(createProductDto);
      this.logger.log(`Product created successfully with id: ${product.id}`);
      return new ProductEntity({
        ...product,
        available: product.available ?? undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<ProductEntity>> {
    try {
      const { products, total } = await this.repo.findAll(page, limit);
      const mappedProducts = products.map((product) =>
        new ProductEntity({
          ...product,
          available: product.available ?? undefined,
        }),
      );
      return new PaginatedResponse(mappedProducts, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to fetch products: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<ProductEntity> {
    try {
      const product = await this.repo.findOne(id);
      if (!product) {
        throw new ProductNotFoundException(id);
      }
      return new ProductEntity({
        ...product,
        available: product.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch product with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    try {
      const existingProduct = await this.repo.findOne(id);
      if (!existingProduct) {
        throw new ProductNotFoundException(id);
      }

      const product = await this.repo.update(id, updateProductDto);
      this.logger.log(`Product updated successfully with id: ${id}`);
      return new ProductEntity({
        ...product,
        available: product.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update product with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<ProductEntity> {
    try {
      const existingProduct = await this.repo.findOne(id);
      if (!existingProduct) {
        throw new ProductNotFoundException(id);
      }

      const product = await this.repo.remove(id);
      this.logger.log(`Product deleted successfully with id: ${id}`);
      return new ProductEntity({
        ...product,
        available: product.available ?? undefined,
      });
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete product with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
