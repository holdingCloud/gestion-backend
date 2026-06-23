import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min, IsNumber, Max, MaxLength, ValidateNested } from 'class-validator';
import { ContactStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class DireccionPrincipalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  calle: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  numero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  departamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  referencia?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  communeId?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-90)
  @Max(90)
  latitud?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-180)
  @Max(180)
  longitud?: number;
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsString()
  phone2?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  companyId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  frequency?: number;

  @IsOptional()
  @IsEnum(ContactStatus)
  contactStatus?: ContactStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => DireccionPrincipalDto)
  direccionPrincipal?: DireccionPrincipalDto;
}
