import { IsInt, IsPositive, IsNumber, Min, IsDateString } from 'class-validator';

export class CreatePurchaseDto {
  @IsInt()
  @IsPositive()
  productsId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @IsPositive()
  unitPrice!: number;

  @IsDateString()
  purchaseDate!: string;
}
