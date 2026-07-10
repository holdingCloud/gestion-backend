import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FiniquitosService } from './finiquitos.service';
import { CreateFiniquitoDto } from './dto/create-finiquito.dto';
import { UpdateEstadoFiniquitoDto } from './dto/update-estado-finiquito.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from 'src/employee/filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('finiquitos')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class FiniquitosController {
  constructor(private readonly service: FiniquitosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFiniquitoDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('employeeId') employeeId?: string) {
    return this.service.findAll(employeeId ? +employeeId : undefined);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoFiniquitoDto) {
    return this.service.updateEstado(id, dto);
  }
}
