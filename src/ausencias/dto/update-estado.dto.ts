import { EstadoSolicitud } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateEstadoDto {
  @IsEnum(EstadoSolicitud)
  estado: EstadoSolicitud;
}
