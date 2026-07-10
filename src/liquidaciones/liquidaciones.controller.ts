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
import { LiquidacionesService } from './liquidaciones.service';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateEstadoLiquidacionDto } from './dto/update-estado-liquidacion.dto';
import { CreateTipoItemDto } from './dto/create-tipo-item.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from 'src/employee/filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('liquidaciones')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class LiquidacionesController {
  constructor(private readonly service: LiquidacionesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateLiquidacionDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('employeeId') employeeId?: string) {
    return this.service.findAll(employeeId ? +employeeId : undefined);
  }

  @Get('libro/:periodo')
  @HttpCode(HttpStatus.OK)
  getLibro(@Param('periodo') periodo: string) {
    return this.service.getLibroPorPeriodo(periodo);
  }

  @Get('tipos-item')
  @HttpCode(HttpStatus.OK)
  findAllTiposItem() {
    return this.service.findAllTiposItem();
  }

  @Post('tipos-item')
  @HttpCode(HttpStatus.CREATED)
  createTipoItem(@Body() dto: CreateTipoItemDto) {
    return this.service.createTipoItem(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoLiquidacionDto) {
    return this.service.updateEstado(id, dto);
  }
}
