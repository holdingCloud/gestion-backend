import { IsArray, IsEnum, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Modulo } from '@prisma/client';

export class AssignModulosDto {
  @ApiProperty({
    description: 'Lista de módulos a asignar al rol',
    enum: Modulo,
    isArray: true,
    example: ['CLIENTES', 'VENTAS', 'REPORTES'],
  })
  @IsArray()
  @ArrayMinSize(0)
  @IsEnum(Modulo, { each: true })
  modulos: Modulo[];
}
