// create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  imagen: string;

  @IsNotEmpty()
  @IsNumber()
  rol: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
  isLoged: boolean;
}