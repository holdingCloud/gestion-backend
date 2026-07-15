import { Parentesco } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateCargaFamiliarDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  rut: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsEnum(Parentesco)
  parentesco: Parentesco;

  @IsDateString()
  fechaNacimiento: string;
}
