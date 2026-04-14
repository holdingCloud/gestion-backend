import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesSheetDto } from './create-sales-sheet.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSalesSheetDto extends PartialType(CreateSalesSheetDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
