import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  frequency?: number;

  @IsOptional()
  @IsEnum(ContactStatus)
  contactStatus?: ContactStatus;
}
