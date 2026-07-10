import { LiquidacionEstado } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateEstadoLiquidacionDto {
  @IsEnum(LiquidacionEstado)
  estado: LiquidacionEstado;
}
