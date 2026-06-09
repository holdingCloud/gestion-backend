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
import { DetailsSalesSheetService } from './details-sales-sheet.service';
import { CreateDetailsSalesSheetDto } from './dto/create-details-sales-sheet.dto';
import { UpdateDetailsSalesSheetDto } from './dto/update-details-sales-sheet.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from './filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParsePaginationPipe } from 'src/common/pipes/parse-pagination.pipe';
import {
  DetailsSalesSheetControllerDocs,
  CreateDetailsSalesSheetDocs,
  FindAllDetailsSalesSheetDocs,
  FindOneDetailsSalesSheetDocs,
  UpdateDetailsSalesSheetDocs,
  RemoveDetailsSalesSheetDocs,
} from 'src/docs/swagger/details-sales-sheet.docs';

@Controller('details-sales-sheet')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@DetailsSalesSheetControllerDocs()
export class DetailsSalesSheetController {
  constructor(private readonly detailsSalesSheetService: DetailsSalesSheetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateDetailsSalesSheetDocs()
  create(@Body() createDetailsSalesSheetDto: CreateDetailsSalesSheetDto) {
    return this.detailsSalesSheetService.create(createDetailsSalesSheetDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ParsePaginationPipe)
  @FindAllDetailsSalesSheetDocs()
  findAll(@Query() pagination: any) {
    return this.detailsSalesSheetService.findAll(pagination.page, pagination.limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @FindOneDetailsSalesSheetDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detailsSalesSheetService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateDetailsSalesSheetDocs()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetailsSalesSheetDto: UpdateDetailsSalesSheetDto,
  ) {
    updateDetailsSalesSheetDto.id = id;
    return this.detailsSalesSheetService.update(id, updateDetailsSalesSheetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RemoveDetailsSalesSheetDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detailsSalesSheetService.remove(id);
  }
}
