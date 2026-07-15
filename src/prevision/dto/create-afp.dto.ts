import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateAfpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  tasaCotizacion: number;
}
