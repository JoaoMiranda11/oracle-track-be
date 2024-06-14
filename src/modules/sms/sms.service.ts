import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsService } from 'src/libs/aws/aws.service';

@Injectable()
export class SmsService {
  constructor(private readonly awsService: AwsService) {}

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    try {
      const data = await this.awsService.sns.publish(params).promise();
      console.log(`Message sent to ${phoneNumber}:`, data);
    } catch (error) {
      console.error(`Error sending message to ${phoneNumber}:`, error);
      throw error;
    }
  }
}
