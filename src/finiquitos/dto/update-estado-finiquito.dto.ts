import { FiniquitoEstado } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateEstadoFiniquitoDto {
  @IsEnum(FiniquitoEstado)
  estado: FiniquitoEstado;
}
