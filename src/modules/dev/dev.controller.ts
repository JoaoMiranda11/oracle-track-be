import { Controller, Post, Body, Get } from '@nestjs/common';
import { SmsService } from '../sms/sms.service';
import { SendSmsDto } from './dto/sendSms.dto';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs'
import * as Papa from 'papaparse'
import { join } from 'path';

@Controller('dev')
export class DevController {
  constructor(
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ) {}

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
  async sendCsvSMS(@Body() sendSmsDto: SendSmsDto) {
    // const { phoneNumber, message } = sendSmsDto;

    const basePath = '/home/joao-miranda/repos/link-forge-be/src/assets/local';
    const file = fs.readFileSync(join(basePath, 'base_apostei.csv'), 'utf-8')
    const results = Papa.parse(file, {
      header: true
    });

    const invalidPhoneUsers: any[] = []
    const validPhones = results.data?.filter((userInfo: any) => {
      if (!userInfo?.phone || typeof userInfo?.phone !== 'string') {
        invalidPhoneUsers.push(userInfo)
        return false;
      }
      if (userInfo.phone.length < 10 || userInfo.phone.includes('00000000') || userInfo.phone.includes('99999999')) {
        invalidPhoneUsers.push(userInfo)
        return false;
      }
      if (!userInfo.phone.startsWith('+')) {
        userInfo.phone = `+55${userInfo.phone}`;
      }
      if (userInfo.phone?.length === 13) {
        const first = (userInfo.phone as string).substring(0, 5);
        const last = (userInfo.phone as string).substring(5);
        userInfo.phone = `${first}9${last}`
      }
      if (userInfo.phone?.length === 15) {'+5502999994243'
        userInfo.phone = (userInfo.phone as string).replaceAll('+550', '+55')
      }
      const phoneRegex = /^\+55(11|12|13|14|15|16|17|18|19|21|22|24|27|28|31|32|33|34|35|37|38|41|42|43|44|45|46|47|48|49|51|53|54|55|61|62|63|64|65|66|67|68|69|71|73|74|75|77|79|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{9}$/;
      if (phoneRegex.test(userInfo.phone)) {
        return true
      } else {
        invalidPhoneUsers.push(userInfo)
        return false;
      }
    })

    fs.writeFileSync(join(basePath, 'invalid_phone_users.csv'), Papa.unparse(invalidPhoneUsers), 'utf8');

    const message = "Seja bem-vindo à Apostei.com! Uma experiência incrível aguarda por você. Deposite qualquer valor para receber até R$600 de Saldo em sua conta: https://apostei.com/"
    // validPhones.forEach((userInfo) => {
    //   // await this.smsService.sendSMS(phoneNumber, message);
    // });
    // await this.smsService.sendSMS('+5587991866024', message);
    await this.smsService.sendSMS('+5587991140155', message);

    return {
      enviados: validPhones?.length,
      invalidos: invalidPhoneUsers?.length,
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
