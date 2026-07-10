import { TipoDocEmpleado } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateDocumentoDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsEnum(TipoDocEmpleado)
  tipo: TipoDocEmpleado;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;
}
