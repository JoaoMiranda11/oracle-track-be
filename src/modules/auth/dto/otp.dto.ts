import { IsEmail, IsNotEmpty, MinLength, Matches, IsString, MaxLength } from 'class-validator';

export class OtpDto {
  @IsEmail()
  readonly email: string;

  @IsEmail()
  readonly hash: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Otp must be 6 characters long' })
  @MaxLength(6, { message: 'Otp must be 6 characters long' })
  readonly otp: string;
}
