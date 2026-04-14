import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsNumber()
	@Min(0)
	quantity: number;

	@IsString()
	@IsNotEmpty()
	img: string;

	@IsString()
	@IsNotEmpty()
	code: string;

	@IsOptional()
	available?: boolean;
}
