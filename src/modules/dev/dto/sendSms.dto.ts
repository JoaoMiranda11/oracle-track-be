import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,3}\d{9,15}$/, {
    message: 'phoneNumber must be a valid international phone number'
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 160, {
    message: 'message must be between 1 and 160 characters'
  })
  message: string;
}
