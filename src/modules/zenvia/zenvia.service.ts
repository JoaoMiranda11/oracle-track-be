import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { zenviaApi } from './zenvia.api';
import { z } from 'zod';

const MessageSchema = z.object({
  message: z.string().min(1).max(160),
});

@Injectable()
export class ZenviaService {
  async sendSms(message: string) {
    const validMsg = await MessageSchema.safeParseAsync(message);
    if (validMsg.error) {
      throw new HttpException('Invalid message length', HttpStatus.BAD_REQUEST);
    }
    return zenviaApi.post('sms/messages', {
      from: 'sender-identifier',
      to: 'recipient-identifier',
      contents: [
        {
          type: 'text',
          text: validMsg.data.message,
        },
      ],
    });
  }
}
