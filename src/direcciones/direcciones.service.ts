import { Injectable } from '@nestjs/common';
import { DireccionesRepository } from './direcciones.repository';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { TiposDireccion } from '@prisma/client';

@Injectable()
export class DireccionesService {
  constructor(private readonly repo: DireccionesRepository) {}

  create(dto: CreateDireccionDto) {
    return this.repo.create(dto);
  }

  findAll(tipo?: TiposDireccion) {
    return this.repo.findAll({ tipo });
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, dto: UpdateDireccionDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }
}
