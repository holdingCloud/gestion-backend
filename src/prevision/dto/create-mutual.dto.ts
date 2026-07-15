import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMutualDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
