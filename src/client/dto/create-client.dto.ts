import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
	@IsString()
	@IsNotEmpty()
	fullname: string;

	@IsString()
	@IsNotEmpty()
	city: string;

	@IsString()
	@IsNotEmpty()
	address: string;

	@IsString()
	@IsNotEmpty()
	zone: string;

	@IsString()
	@IsNotEmpty()
	phone: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}
