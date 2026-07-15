import { Injectable, Logger } from '@nestjs/common';
import { DocumentosEmpleadoRepository } from './documentos-empleado.repository';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { CreateCargaFamiliarDto } from './dto/create-carga-familiar.dto';

@Injectable()
export class DocumentosEmpleadoService {
  private readonly logger = new Logger(DocumentosEmpleadoService.name);

  constructor(private repo: DocumentosEmpleadoRepository) {}

  createDocumento(dto: CreateDocumentoDto) { return this.repo.createDocumento(dto); }
  findDocumentos(employeeId: number) { return this.repo.findDocumentos(employeeId); }
  removeDocumento(id: number) { return this.repo.removeDocumento(id); }

  createCuenta(dto: CreateCuentaBancariaDto) { return this.repo.createCuenta(dto); }
  findCuentas(employeeId: number) { return this.repo.findCuentas(employeeId); }
  removeCuenta(id: number) { return this.repo.removeCuenta(id); }

  createCarga(dto: CreateCargaFamiliarDto) { return this.repo.createCarga(dto); }
  findCargas(employeeId: number) { return this.repo.findCargas(employeeId); }
  removeCarga(id: number) { return this.repo.removeCarga(id); }
}
