import { IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class WsSalesSheetDetailDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clientsId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  productsId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discount: number;
}
