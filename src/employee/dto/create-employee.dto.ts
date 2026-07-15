import { EstadoCivil, typePosition } from '@prisma/client';
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DireccionPrincipalDto } from 'src/client/dto/create-client.dto';

export class CreateEmployeeDto {
	@IsString()
	@IsNotEmpty()
	rut: string;

	@IsString()
	@IsNotEmpty()
	fullname: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNumber()
	@Min(0)
	salary: number;

	@IsDateString()
	@IsNotEmpty()
	hireDate: string;

	@IsOptional()
	@IsEnum(typePosition)
	type?: typePosition;

	@IsOptional()
	@IsDateString()
	fechaNacimiento?: string;

	@IsOptional()
	@IsEnum(EstadoCivil)
	estadoCivil?: EstadoCivil;

	@IsOptional()
	@IsInt()
	@IsPositive()
	cargoId?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	departamentoId?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	afpId?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	sistemasSaludId?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	mutualId?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	jefeId?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => DireccionPrincipalDto)
	direccionPrincipal?: DireccionPrincipalDto;
}
