import { TipoCuentaBancaria } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateCuentaBancariaDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  banco: string;

  @IsEnum(TipoCuentaBancaria)
  tipoCuenta: TipoCuentaBancaria;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  numeroCuenta: string;

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}
