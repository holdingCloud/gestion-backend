import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { typePosition } from '@prisma/client';

export class CreateRoleDto {
  @ApiProperty({ enum: typePosition, description: 'Tipo de posición del rol' })
  @IsEnum(typePosition)
  @IsNotEmpty()
  type!: typePosition;
}
