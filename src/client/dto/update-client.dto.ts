import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateClientDto extends PartialType(OmitType(CreateClientDto, ['frequency'] as const)) {
  @IsOptional()
  @IsNumber()
  id?: number;
}
