import { IsBoolean, IsEmail, IsEmpty, isNotEmpty, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCompanyDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsOptional() 
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  companyname: string;

  @IsString()
  @IsOptional() 
  googleId?: string;

  @IsBoolean()
  @IsOptional() 
  is_verified?: boolean;
}