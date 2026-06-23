import { Module } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { DireccionesController } from './direcciones.controller';
import { DireccionesRepository } from './direcciones.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DireccionesController],
  providers: [DireccionesService, DireccionesRepository],
  exports: [DireccionesService, DireccionesRepository],
})
export class DireccionesModule {}
