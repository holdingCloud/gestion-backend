import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './create-bill.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateBillDto extends PartialType(CreateBillDto) {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
