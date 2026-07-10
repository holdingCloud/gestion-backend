import { Module } from '@nestjs/common';
import { AusenciasService } from './ausencias.service';
import { AusenciasController } from './ausencias.controller';
import { AusenciasRepository } from './ausencias.repository';

@Module({
  controllers: [AusenciasController],
  providers: [AusenciasService, AusenciasRepository],
})
export class AusenciasModule {}
