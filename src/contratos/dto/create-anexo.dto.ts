import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateAnexoDto {
  @IsInt()
  @IsPositive()
  contratoId: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDateString()
  fechaVigencia: string;

  @IsOptional()
  @IsString()
  urlDocumento?: string;
}
