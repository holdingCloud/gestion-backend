import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailsSalesSheetDto } from './create-details-sales-sheet.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDetailsSalesSheetDto extends PartialType(CreateDetailsSalesSheetDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
