import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { DepartamentosRepository } from './departamentos.repository';
import { CargosService } from './cargos.service';
import { CargosController } from './cargos.controller';
import { CargosRepository } from './cargos.repository';

@Module({
  controllers: [DepartamentosController, CargosController],
  providers: [DepartamentosService, DepartamentosRepository, CargosService, CargosRepository],
})
export class DepartamentosModule {}
