import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { TiposDireccion } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  DireccionesControllerDocs,
  CreateDireccionDocs,
  FindAllDireccionesDocs,
  FindOneDireccionDocs,
  UpdateDireccionDocs,
  DeleteDireccionDocs,
} from 'src/docs/swagger/direcciones.docs';

@Controller('direcciones')
@UseGuards(JwtAuthGuard)
@DireccionesControllerDocs()
export class DireccionesController {
  constructor(private readonly service: DireccionesService) {}

  @Post()
  @CreateDireccionDocs()
  create(@Body() dto: CreateDireccionDto) {
    return this.service.create(dto);
  }

  @Get()
  @FindAllDireccionesDocs()
  findAll(@Query('tipo') tipo?: TiposDireccion) {
    return this.service.findAll(tipo);
  }

  @Get(':id')
  @FindOneDireccionDocs()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UpdateDireccionDocs()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDireccionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @DeleteDireccionDocs()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
