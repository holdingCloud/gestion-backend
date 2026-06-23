import { typePosition } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
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

	@IsString()
	@IsNotEmpty()
	hireDate: string;

	@IsOptional()
	@IsEnum(typePosition)
	type?: typePosition;

	@IsOptional()
	@ValidateNested()
	@Type(() => DireccionPrincipalDto)
	direccionPrincipal?: DireccionPrincipalDto;
}
