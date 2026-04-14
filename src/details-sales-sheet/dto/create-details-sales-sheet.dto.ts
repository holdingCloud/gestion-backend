import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateDetailsSalesSheetDto {
  @IsInt()
  @Min(1)
  clientsId: number;

  @IsInt()
  @Min(1)
  productsId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsInt()
  @Min(1)
  salesSheetId: number;
}
