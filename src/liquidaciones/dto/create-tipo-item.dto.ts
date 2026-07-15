import { TipoItemLiquidacionEnum } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTipoItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsEnum(TipoItemLiquidacionEnum)
  tipo: TipoItemLiquidacionEnum;

  @IsOptional()
  @IsBoolean()
  esLegal?: boolean;
}
