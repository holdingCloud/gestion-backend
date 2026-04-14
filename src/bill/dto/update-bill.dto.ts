import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './create-bill.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBillDto extends PartialType(CreateBillDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
