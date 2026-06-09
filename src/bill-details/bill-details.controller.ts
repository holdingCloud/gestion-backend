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
import { BillDetailsService } from './bill-details.service';
import { CreateBillDetailsDto } from './dto/create-bill-details.dto';
import { UpdateBillDetailsDto } from './dto/update-bill-details.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import {
  BillDetailsControllerDocs,
  CreateBillDetailsDocs,
  FindAllBillDetailsDocs,
  FindOneBillDetailsDocs,
  UpdateBillDetailsDocs,
  RemoveBillDetailsDocs,
} from 'src/docs/swagger/bill-details.docs';

@Controller('bill-details')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@BillDetailsControllerDocs()
export class BillDetailsController {
  constructor(private readonly billDetailsService: BillDetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateBillDetailsDocs()
  create(@Body() createBillDetailsDto: CreateBillDetailsDto) {
    return this.billDetailsService.create(createBillDetailsDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ParsePaginationPipe)
  @FindAllBillDetailsDocs()
  findAll(@Query() pagination: any) {
    return this.billDetailsService.findAll(pagination.page, pagination.limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneBillDetailsDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billDetailsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateBillDetailsDocs()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDetailsDto: UpdateBillDetailsDto,
  ) {
    updateBillDetailsDto.id = id;
    return this.billDetailsService.update(id, updateBillDetailsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveBillDetailsDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.billDetailsService.remove(id);
  }
}
