import { EstadoSolicitud, TipoVacaciones } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateVacacionDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsEnum(TipoVacaciones)
  tipo: TipoVacaciones;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsInt()
  @IsPositive()
  diasHabiles: number;

  @IsOptional()
  @IsEnum(EstadoSolicitud)
  estado?: EstadoSolicitud;
}
