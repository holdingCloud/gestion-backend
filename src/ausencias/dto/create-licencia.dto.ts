import { EntidadLicencia, EstadoSolicitud, TipoLicencia } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateLicenciaDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsEnum(TipoLicencia)
  tipo: TipoLicencia;

  @IsEnum(EntidadLicencia)
  entidad: EntidadLicencia;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsInt()
  @IsPositive()
  dias: number;

  @IsOptional()
  @IsString()
  urlDocumento?: string;

  @IsOptional()
  @IsEnum(EstadoSolicitud)
  estado?: EstadoSolicitud;
}
