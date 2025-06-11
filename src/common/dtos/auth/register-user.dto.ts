import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password?: string;

  @IsOptional()
  @IsString()
  googleId?: string;
}
