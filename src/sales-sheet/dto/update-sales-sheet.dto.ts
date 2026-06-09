import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesSheetDto } from './create-sales-sheet.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateSalesSheetDto extends PartialType(CreateSalesSheetDto) {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
