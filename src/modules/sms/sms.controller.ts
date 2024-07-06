import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SmsService } from './sms.service';
import { cleanupPhoneNumbers } from 'src/utils/sanetizations';
import { SendSmsDto } from './dto/sendSms.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { RequestUser } from 'src/decorators/requestUser.decorator';
import { JwtUserInfo } from '../auth/auth.types';
import { WebsocketService } from '../websocket/websocket.service';
import { WebsocketEventNames } from '../websocket/websocket.enum';
import { Delay } from 'src/utils/common';
import { WebsocketMultiEvents } from '../websocket/websocket.multievents';

@Controller('sms')
export class SmsController {
  constructor(
    private readonly smsService: SmsService,
    private readonly websocketService: WebsocketService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Body() body: SendSmsDto,
    @RequestUser() user: JwtUserInfo,
  ) {
    const wsMe = new WebsocketMultiEvents(
      this.websocketService,
      user._id,
      WebsocketEventNames.FEEDBACK_SEND_SMS,
    );
    wsMe.emit('Processando arquivos', { step: 0 });
    await Delay();
    const data = await this.smsService.processCSV(file);
    wsMe.emit('Validando dados', { step: 0 });
    await Delay();
    const { invalid, valid } = cleanupPhoneNumbers(data);
    const phones = valid.map((message) => message.phone);
    wsMe.emit(`Enviando mensagens ${0}/${phones.length}`, { step: 0 });
    const result = await this.smsService.sendMany(
      user._id,
      body.message,
      phones,
      body.metadata,
      {
        debounce: 50,
        every: (data) => {
          const stepValue = Math.round(
            (data.index * 100) / (phones.length || 1),
          );
          wsMe.emit(`Enviando mensagens ${data.index}/${phones.length}`, {
            step: stepValue,
          });
        },
      },
    );

    await Delay();
    return { invalid: invalid, sent: result };
  }
}
