import { Module } from '@nestjs/common';
import { FiniquitosService } from './finiquitos.service';
import { FiniquitosController } from './finiquitos.controller';
import { FiniquitosRepository } from './finiquitos.repository';

@Module({
  controllers: [FiniquitosController],
  providers: [FiniquitosService, FiniquitosRepository],
})
export class FiniquitosModule {}
