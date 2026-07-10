import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { DocumentosEmpleadoService } from './documentos-empleado.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { CreateCargaFamiliarDto } from './dto/create-carga-familiar.dto';
import { PrismaExceptionFilter, HttpExceptionFilter } from 'src/employee/filters';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('empleados')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class DocumentosEmpleadoController {
  constructor(private readonly service: DocumentosEmpleadoService) {}

  // ── Documentos ──
  @Post(':employeeId/documentos')
  @HttpCode(HttpStatus.CREATED)
  createDocumento(@Param('employeeId', ParseIntPipe) employeeId: number, @Body() dto: CreateDocumentoDto) {
    return this.service.createDocumento({ ...dto, employeeId });
  }

  @Get(':employeeId/documentos')
  @HttpCode(HttpStatus.OK)
  findDocumentos(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.service.findDocumentos(employeeId);
  }

  @Delete(':employeeId/documentos/:id')
  @HttpCode(HttpStatus.OK)
  removeDocumento(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeDocumento(id);
  }

  // ── Cuentas Bancarias ──
  @Post(':employeeId/cuentas-bancarias')
  @HttpCode(HttpStatus.CREATED)
  createCuenta(@Param('employeeId', ParseIntPipe) employeeId: number, @Body() dto: CreateCuentaBancariaDto) {
    return this.service.createCuenta({ ...dto, employeeId });
  }

  @Get(':employeeId/cuentas-bancarias')
  @HttpCode(HttpStatus.OK)
  findCuentas(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.service.findCuentas(employeeId);
  }

  @Delete(':employeeId/cuentas-bancarias/:id')
  @HttpCode(HttpStatus.OK)
  removeCuenta(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeCuenta(id);
  }

  // ── Cargas Familiares ──
  @Post(':employeeId/cargas-familiares')
  @HttpCode(HttpStatus.CREATED)
  createCarga(@Param('employeeId', ParseIntPipe) employeeId: number, @Body() dto: CreateCargaFamiliarDto) {
    return this.service.createCarga({ ...dto, employeeId });
  }

  @Get(':employeeId/cargas-familiares')
  @HttpCode(HttpStatus.OK)
  findCargas(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.service.findCargas(employeeId);
  }

  @Delete(':employeeId/cargas-familiares/:id')
  @HttpCode(HttpStatus.OK)
  removeCarga(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeCarga(id);
  }
}
