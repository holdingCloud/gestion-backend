import { Controller, Get, Put, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RolModulosService } from './rol-modulos.service';
import { AssignModulosDto } from './dto/assign-modulos.dto';
import { Modulo } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolGuard } from 'src/auth/guards/rol.guard';
import { RequiereRol } from 'src/auth/decorators/requiere-rol.decorator';
import {
  RolModulosControllerDocs,
  GetAllRolesDocs,
  GetModulosByRolDocs,
  SetModulosDocs,
  AddModuloDocs,
  RemoveModuloDocs,
} from 'src/docs/swagger/rol-modulos.docs';

@Controller('rol-modulos')
@UseGuards(JwtAuthGuard)
@RolModulosControllerDocs()
export class RolModulosController {
  constructor(private readonly service: RolModulosService) {}

  @Get()
  @GetAllRolesDocs()
  getAllRoles() {
    return this.service.getAllRolesWithModulos();
  }

  @Get(':rolId')
  @GetModulosByRolDocs()
  getModulosByRol(@Param('rolId', ParseIntPipe) rolId: number) {
    return this.service.getModulosByRol(rolId);
  }

  @Put(':rolId')
  @UseGuards(RolGuard)
  @RequiereRol('SUPER_ADMIN')
  @SetModulosDocs()
  setModulos(@Param('rolId', ParseIntPipe) rolId: number, @Body() dto: AssignModulosDto) {
    return this.service.setModulos(rolId, dto);
  }

  @Post(':rolId/:modulo')
  @UseGuards(RolGuard)
  @RequiereRol('SUPER_ADMIN')
  @AddModuloDocs()
  addModulo(@Param('rolId', ParseIntPipe) rolId: number, @Param('modulo') modulo: Modulo) {
    return this.service.addModulo(rolId, modulo);
  }

  @Delete(':rolId/:modulo')
  @UseGuards(RolGuard)
  @RequiereRol('SUPER_ADMIN')
  @RemoveModuloDocs()
  removeModulo(@Param('rolId', ParseIntPipe) rolId: number, @Param('modulo') modulo: Modulo) {
    return this.service.removeModulo(rolId, modulo);
  }
}
