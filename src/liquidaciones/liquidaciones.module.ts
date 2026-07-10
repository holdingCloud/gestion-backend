import { Module } from '@nestjs/common';
import { LiquidacionesService } from './liquidaciones.service';
import { LiquidacionesController } from './liquidaciones.controller';
import { LiquidacionesRepository } from './liquidaciones.repository';
import { ContratosModule } from 'src/contratos/contratos.module';

@Module({
  imports: [ContratosModule],
  controllers: [LiquidacionesController],
  providers: [LiquidacionesService, LiquidacionesRepository],
})
export class LiquidacionesModule {}
