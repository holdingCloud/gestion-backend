import { Module } from '@nestjs/common';
import { RolModulosController } from './rol-modulos.controller';
import { RolModulosService } from './rol-modulos.service';
import { RolModulosRepository } from './rol-modulos.repository';
import { RolGuard } from 'src/auth/guards/rol.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolModulosController],
  providers: [RolModulosService, RolModulosRepository, RolGuard],
  exports: [RolModulosRepository],
})
export class RolModulosModule {}
