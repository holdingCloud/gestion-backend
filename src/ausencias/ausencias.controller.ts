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
import { AusenciasService } from './ausencias.service';
import { CreateVacacionDto } from './dto/create-vacacion.dto';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from 'src/employee/filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ausencias')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class AusenciasController {
  constructor(private readonly service: AusenciasService) {}

  // ── Vacaciones ──
  @Post('vacaciones')
  @HttpCode(HttpStatus.CREATED)
  createVacacion(@Body() dto: CreateVacacionDto) {
    return this.service.createVacacion(dto);
  }

  @Get('vacaciones')
  @HttpCode(HttpStatus.OK)
  findVacaciones(@Query('employeeId') employeeId?: string) {
    return this.service.findVacaciones(employeeId ? +employeeId : undefined);
  }

  @Patch('vacaciones/:id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstadoVacacion(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoDto) {
    return this.service.updateEstadoVacacion(id, dto);
  }

  // ── Licencias ──
  @Post('licencias')
  @HttpCode(HttpStatus.CREATED)
  createLicencia(@Body() dto: CreateLicenciaDto) {
    return this.service.createLicencia(dto);
  }

  @Get('licencias')
  @HttpCode(HttpStatus.OK)
  findLicencias(@Query('employeeId') employeeId?: string) {
    return this.service.findLicencias(employeeId ? +employeeId : undefined);
  }

  @Patch('licencias/:id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstadoLicencia(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoDto) {
    return this.service.updateEstadoLicencia(id, dto);
  }

  // ── Permisos ──
  @Post('permisos')
  @HttpCode(HttpStatus.CREATED)
  createPermiso(@Body() dto: CreatePermisoDto) {
    return this.service.createPermiso(dto);
  }

  @Get('permisos')
  @HttpCode(HttpStatus.OK)
  findPermisos(@Query('employeeId') employeeId?: string) {
    return this.service.findPermisos(employeeId ? +employeeId : undefined);
  }

  @Patch('permisos/:id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstadoPermiso(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoDto) {
    return this.service.updateEstadoPermiso(id, dto);
  }
}
