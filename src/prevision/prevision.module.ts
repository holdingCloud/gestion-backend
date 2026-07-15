import { Module } from '@nestjs/common';
import { AfpService } from './afp.service';
import { AfpController } from './afp.controller';
import { AfpRepository } from './afp.repository';
import { SistemasSaludService } from './sistemas-salud.service';
import { SistemasSaludController } from './sistemas-salud.controller';
import { SistemasSaludRepository } from './sistemas-salud.repository';
import { MutualesService } from './mutuales.service';
import { MutualesController } from './mutuales.controller';
import { MutualesRepository } from './mutuales.repository';

@Module({
  controllers: [AfpController, SistemasSaludController, MutualesController],
  providers: [
    AfpService, AfpRepository,
    SistemasSaludService, SistemasSaludRepository,
    MutualesService, MutualesRepository,
  ],
})
export class PrevisionModule {}
