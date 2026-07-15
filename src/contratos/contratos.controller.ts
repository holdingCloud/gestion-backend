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
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { CreateAnexoDto } from './dto/create-anexo.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from 'src/employee/filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('contratos')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class ContratosController {
  constructor(private readonly service: ContratosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateContratoDto) {
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContratoDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/anexos')
  @HttpCode(HttpStatus.CREATED)
  addAnexo(@Param('id', ParseIntPipe) contratoId: number, @Body() dto: CreateAnexoDto) {
    return this.service.addAnexo(contratoId, dto);
  }

  @Get(':id/anexos')
  @HttpCode(HttpStatus.OK)
  findAnexos(@Param('id', ParseIntPipe) contratoId: number) {
    return this.service.findAnexos(contratoId);
  }
}
