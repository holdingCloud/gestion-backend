import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateSalesSheetDto {
  @IsInt()
  @Min(1)
  employeeId: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  billId: number;
}
