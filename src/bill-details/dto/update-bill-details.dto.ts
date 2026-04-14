import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDetailsDto } from './create-bill-details.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBillDetailsDto extends PartialType(CreateBillDetailsDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
