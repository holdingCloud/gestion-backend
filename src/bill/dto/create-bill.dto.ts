import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBillDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
