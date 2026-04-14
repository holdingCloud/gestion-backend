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
import { SalesSheetService } from './sales-sheet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import { CreateSalesSheetDto } from './dto/create-sales-sheet.dto';
import { UpdateSalesSheetDto } from './dto/update-sales-sheet.dto';

@Controller('sales-sheet')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class SalesSheetController {
  constructor(private readonly salesSheetService: SalesSheetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSalesSheetDto: CreateSalesSheetDto) {
    return this.salesSheetService.create(createSalesSheetDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ParsePaginationPipe)
  findAll(@Query() pagination: any) {
    return this.salesSheetService.findAll(pagination.page, pagination.limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salesSheetService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalesSheetDto: UpdateSalesSheetDto,
  ) {
    updateSalesSheetDto.id = id;
    return this.salesSheetService.update(id, updateSalesSheetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salesSheetService.remove(id);
  }
}
