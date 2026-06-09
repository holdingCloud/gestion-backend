import { IsEnum, IsNotEmpty } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class UpdateContactStatusDto {
  @IsEnum(ContactStatus)
  @IsNotEmpty()
  contactStatus!: ContactStatus;
}
