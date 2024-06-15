import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class AuthInfoDto {
  @IsOptional()
  @IsString()
  otp: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate: Date | null;

  @IsOptional()
  @IsString()
  hash: string | null;

  @IsOptional()
  @IsString()
  tries: number | null;
}

export class UpdateUserDto {
  @IsOptional()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  readonly password?: string;

  @IsOptional()
  readonly auth?: AuthInfoDto;
}
