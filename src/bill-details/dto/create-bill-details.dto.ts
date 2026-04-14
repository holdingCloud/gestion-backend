import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateBillDetailsDto {
  @IsInt()
  @Min(0)
  amount: number;

  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  billsId: number;
}
