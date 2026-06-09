import { IsOptional, IsPositive, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';


export class PaginationDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  fullName?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  email?: string;
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;

 
}
