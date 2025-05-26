import { IsString, IsNotEmpty, IsEmail, IsArray, IsOptional } from 'class-validator';

export class Member {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsArray()
  @IsOptional()
  friends?: any[];

  @IsString()
  @IsOptional()
  memberStatus?: string;
}
