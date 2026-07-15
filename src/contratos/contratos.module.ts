import { Module } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { ContratosController } from './contratos.controller';
import { ContratosRepository } from './contratos.repository';

@Module({
  controllers: [ContratosController],
  providers: [ContratosService, ContratosRepository],
  exports: [ContratosRepository],
})
export class ContratosModule {}
