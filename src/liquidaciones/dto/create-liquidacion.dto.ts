import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateLiquidacionDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsDateString()
  periodo: string;
}
