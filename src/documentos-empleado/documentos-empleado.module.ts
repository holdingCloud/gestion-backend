import { Module } from '@nestjs/common';
import { DocumentosEmpleadoService } from './documentos-empleado.service';
import { DocumentosEmpleadoController } from './documentos-empleado.controller';
import { DocumentosEmpleadoRepository } from './documentos-empleado.repository';

@Module({
  controllers: [DocumentosEmpleadoController],
  providers: [DocumentosEmpleadoService, DocumentosEmpleadoRepository],
})
export class DocumentosEmpleadoModule {}
