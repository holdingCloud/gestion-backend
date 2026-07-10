import { IsDateString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateAnticipoDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;

  @IsDateString()
  fecha: string;
}
