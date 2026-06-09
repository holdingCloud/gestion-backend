import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailsSalesSheetDto } from './create-details-sales-sheet.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateDetailsSalesSheetDto extends PartialType(CreateDetailsSalesSheetDto) {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
