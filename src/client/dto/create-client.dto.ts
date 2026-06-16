import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsOptional()
  @IsString()
  n_depto_casa?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  communeId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  frequency?: number;

  @IsOptional()
  @IsEnum(ContactStatus)
  contactStatus?: ContactStatus;
}
