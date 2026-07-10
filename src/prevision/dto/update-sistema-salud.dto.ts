import { PartialType } from '@nestjs/mapped-types';
import { CreateSistemaSaludDto } from './create-sistema-salud.dto';

export class UpdateSistemaSaludDto extends PartialType(CreateSistemaSaludDto) {
  id?: number;
}
