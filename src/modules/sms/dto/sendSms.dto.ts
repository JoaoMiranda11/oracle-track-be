import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { IsMetadataObject } from 'src/decorators/validatorMetadata.decorator';

export class SendSmsDto {
  @IsString()
  @IsOptional()
  @Length(1, 160, {
    message: 'Title must be between 1 and 160 characters',
  })
  title?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 160, {
    message: 'Message must be between 1 and 160 characters',
  })
  message: string;

  @IsOptional()
  @IsMetadataObject({
    message:
      'Metadata must be an object with a maximum of 10 keys, and each value must be a string with a maximum of 30 characters',
  })
  metadata: { [key: string]: string };
}
