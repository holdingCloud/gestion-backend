import { ContratoEstado, TipoContrato, TipoGratificacion } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateContratoDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsEnum(TipoContrato)
  tipoContrato: TipoContrato;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sueldoBase: number;

  @IsEnum(TipoGratificacion)
  gratificacion: TipoGratificacion;

  @IsInt()
  @Min(1)
  @Max(40)
  jornada: number;

  @IsDateString()
  fechaInicio: string;

  @IsOptional()
  @IsDateString()
  fechaTermino?: string;

  @IsOptional()
  @IsEnum(ContratoEstado)
  estado?: ContratoEstado;
}
