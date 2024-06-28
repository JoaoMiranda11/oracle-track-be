import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class SendSmsDto {
  @IsString()
  @IsOptional()
  @Length(1, 160, {
    message: 'Title must be between 1 and 160 characters'
  })
  title?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 160, {
    message: 'Message must be between 1 and 160 characters'
  })
  message: string;
}
