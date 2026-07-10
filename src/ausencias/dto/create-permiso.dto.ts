import { EstadoSolicitud, TipoPermiso } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePermisoDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsEnum(TipoPermiso)
  tipo: TipoPermiso;

  @IsBoolean()
  @IsOptional()
  conGoce?: boolean;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsEnum(EstadoSolicitud)
  estado?: EstadoSolicitud;
}
