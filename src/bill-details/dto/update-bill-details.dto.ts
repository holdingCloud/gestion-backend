import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDetailsDto } from './create-bill-details.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateBillDetailsDto extends PartialType(CreateBillDetailsDto) {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
