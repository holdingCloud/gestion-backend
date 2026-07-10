import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSistemaSaludDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['FONASA', 'ISAPRE'])
  tipo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
