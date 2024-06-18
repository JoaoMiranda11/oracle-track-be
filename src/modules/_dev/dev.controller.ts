import { Controller, Post, Body, Get } from '@nestjs/common';
import { SmsService } from '../sms/sms.service';
import { SendSmsDto } from './dto/sendSms.dto';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import { join } from 'path';
import { cleanupPhoneNumber } from 'src/utils/sanetizations';
import { ProductsService } from '../products/products.service';
import { PaymentService } from '../payments/payment.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { WebsocketService } from '../websocket/websocket.service';

@Controller('dev')
export class DevController {
  constructor(
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentService,
    private readonly wsService: WebsocketService,
  ) {}

  @Post('plan')
  async createPlan() {
    return await this.productsService.createPlan({
      description: 'Plano básico',
      duration: 30,
      name: 'BASIC',
      price: 100000,
    });
  }

  @Post('ws')
  async sendMsg() {
    await this.wsService.emitToUser(
      '666fb9eebdee4cc9815e5243',
      'notification',
      'Teste',
    );
  }

  @Post('sms')
  async sendSMS(@Body() sendSmsDto: SendSmsDto) {
    const { phoneNumber, message } = sendSmsDto;

    try {
      await this.smsService.sendSMS(phoneNumber, message);
      return 'SMS sent successfully.';
    } catch (error) {
      return 'Failed to send SMS.';
    }
  }

  @Post('sms/local/csv')
  async sendCsvSMS() {
    const basePath = '/home/joao-miranda/repos/link-forge-be/src/assets/local';
    const file = fs.readFileSync(join(basePath, 'base_apostei.csv'), 'utf-8');
    const results = Papa.parse(file, {
      header: true,
    });

    const { invalid, valid } = cleanupPhoneNumber(
      (results.data ?? []) as any[],
    );

    fs.writeFileSync(
      join(basePath, 'invalid_phone_users.csv'),
      Papa.unparse(invalid),
      'utf8',
    );

    const message =
      'Seja bem-vindo à Apostei.com! Uma experiência incrível aguarda por você. Deposite qualquer valor para receber até R$600 de Saldo em sua conta: https://apostei.com/';
    await this.smsService.sendSMS('+5587991140155', message);

    return {
      enviados: valid?.length,
      invalidos: invalid?.length,
    };
  }

  @Post('mail')
  async sendMail() {
    return await this.mailService.sendMail({
      subject: '',
      toAddress: ['jsm2.pe@gmail.com'],
      body: {
        html: 'Teste',
      },
    });
  }

  @Get('ping')
  async ping() {
    return 'pong';
  }
}
