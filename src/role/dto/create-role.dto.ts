import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ type: String, description: 'Nombre único del rol (ej: ADMINISTRADOR, BODEGUERO, SUPERVISOR)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  type!: string;
}
