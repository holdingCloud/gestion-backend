import { typePosition } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

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

	@IsString()
	@IsNotEmpty()
	city: string;

	@IsString()
	@IsNotEmpty()
	address: string;

	@IsOptional()
	@IsEnum(typePosition)
	type?: typePosition;
}
