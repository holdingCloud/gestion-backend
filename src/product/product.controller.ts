import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import {
  ProductControllerDocs,
  CreateProductDocs,
  FindAllProductsDocs,
  FindOneProductDocs,
  UpdateProductDocs,
  RemoveProductDocs,
} from 'src/docs/swagger/product.docs';

@Controller('product')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@ProductControllerDocs()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateProductDocs()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ParsePaginationPipe)
  @FindAllProductsDocs()
  findAll(@Query() pagination: any) {
    return this.productService.findAll(pagination.page, pagination.limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneProductDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateProductDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    updateProductDto.id = id;
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveProductDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
