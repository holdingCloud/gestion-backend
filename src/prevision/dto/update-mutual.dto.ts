import { PartialType } from '@nestjs/mapped-types';
import { CreateMutualDto } from './create-mutual.dto';

export class UpdateMutualDto extends PartialType(CreateMutualDto) {
  id?: number;
}
