import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/libs/aws/aws.service';

interface SendMailParams {
  /**
   * @description Body of email
   */
  subject: string;
  body: {
    html?: string,
    text?: string
  }

  toAddress: string[]
  ccAddress?: string[]
  bccAddress?: string[]

}

@Injectable()
export class MailService {
  constructor(private readonly awsService: AwsService) {}

  async sendMail(params: SendMailParams) {
    const Charset = 'UTF-8'
    await this.awsService.ses.sendEmail({
      Source: 'suporte@hayekmarketing.com.br',
      Destination: {
        ToAddresses: params.toAddress,
        CcAddresses: params.ccAddress,
        BccAddresses: params.bccAddress,
      },
      Message: {
        Subject: {
          Charset,
          Data: params.subject,
        },
        Body: {
          Text: {
            Charset,
            Data: params.body.html
          },
          Html: {
            Charset,
            Data: params.body.html
          }
        }
      },
    });
  }
}
