import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductNotFoundException } from './exceptions';
import { PaginatedResponse } from 'src/common/responses/paginated.response';
import { RedisService } from 'src/redis/redis.service';

const PRODUCT_LIST_TTL = 300;
const PRODUCT_ONE_TTL = 600;

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private repo: ProductRepository,
    private redis: RedisService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = await this.repo.create(createProductDto);
      this.logger.log(`Product created successfully with id: ${product.id}`);
      await this.redis.delByPattern('product:list:*');
      return new ProductEntity({ ...product, available: product.available ?? undefined });
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<ProductEntity>> {
    try {
      const cacheKey = `product:list:${page}:${limit}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached) as PaginatedResponse<ProductEntity>;

      const { products, total } = await this.repo.findAll(page, limit);
      const mappedProducts = products.map(
        (p) => new ProductEntity({ ...p, available: p.available ?? undefined }),
      );
      const result = new PaginatedResponse(mappedProducts, total, page, limit);
      await this.redis.set(cacheKey, JSON.stringify(result), PRODUCT_LIST_TTL);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch products: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<ProductEntity> {
    try {
      const cacheKey = `product:one:${id}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached) as ProductEntity;

      const product = await this.repo.findOne(id);
      if (!product) throw new ProductNotFoundException(id);

      const entity = new ProductEntity({ ...product, available: product.available ?? undefined });
      await this.redis.set(cacheKey, JSON.stringify(entity), PRODUCT_ONE_TTL);
      return entity;
    } catch (error) {
      if (error instanceof ProductNotFoundException) throw error;
      this.logger.error(`Failed to fetch product with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    try {
      const existingProduct = await this.repo.findOne(id);
      if (!existingProduct) throw new ProductNotFoundException(id);

      const product = await this.repo.update(id, updateProductDto);
      this.logger.log(`Product updated successfully with id: ${id}`);
      await Promise.all([
        this.redis.del(`product:one:${id}`),
        this.redis.delByPattern('product:list:*'),
      ]);
      return new ProductEntity({ ...product, available: product.available ?? undefined });
    } catch (error) {
      if (error instanceof ProductNotFoundException) throw error;
      this.logger.error(`Failed to update product with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<ProductEntity> {
    try {
      const existingProduct = await this.repo.findOne(id);
      if (!existingProduct) throw new ProductNotFoundException(id);

      const product = await this.repo.remove(id);
      this.logger.log(`Product deleted successfully with id: ${id}`);
      await Promise.all([
        this.redis.del(`product:one:${id}`),
        this.redis.delByPattern('product:list:*'),
      ]);
      return new ProductEntity({ ...product, available: product.available ?? undefined });
    } catch (error) {
      if (error instanceof ProductNotFoundException) throw error;
      this.logger.error(`Failed to delete product with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
