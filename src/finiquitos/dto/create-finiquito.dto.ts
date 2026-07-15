import { CausalFiniquito } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsPositive } from 'class-validator';

export class CreateFiniquitoDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsEnum(CausalFiniquito)
  causal: CausalFiniquito;

  @IsDateString()
  fechaTermino: string;
}
