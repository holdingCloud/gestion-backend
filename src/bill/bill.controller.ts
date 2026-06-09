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
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import {
  BillControllerDocs,
  CreateBillDocs,
  FindAllBillsDocs,
  FindOneBillDocs,
  UpdateBillDocs,
  RemoveBillDocs,
} from 'src/docs/swagger/bill.docs';

@Controller('bill')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@BillControllerDocs()
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateBillDocs()
  create(@Body() createBillDto: CreateBillDto) {
    return this.billService.create(createBillDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ParsePaginationPipe)
  @FindAllBillsDocs()
  findAll(@Query() pagination: any) {
    return this.billService.findAll(pagination.page, pagination.limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneBillDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateBillDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBillDto: UpdateBillDto) {
    updateBillDto.id = id;
    return this.billService.update(id, updateBillDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveBillDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.billService.remove(id);
  }
}
