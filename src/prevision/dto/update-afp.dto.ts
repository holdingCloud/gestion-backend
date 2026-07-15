import { PartialType } from '@nestjs/mapped-types';
import { CreateAfpDto } from './create-afp.dto';

export class UpdateAfpDto extends PartialType(CreateAfpDto) {
  id?: number;
}
