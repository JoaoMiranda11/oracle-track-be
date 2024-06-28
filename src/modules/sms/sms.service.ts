import { Injectable } from '@nestjs/common';
import * as Papa from 'papaparse';

interface SmsMessage {
  phone: string
  message: string
  title: string
}

@Injectable()
export class SmsService {
  constructor() {}

  async processCSV(file: Express.Multer.File) {
    const fileContent = file.buffer.toString('utf-8');

    const results = Papa.parse<any>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    const formatedData = results.data.map((data) => ({
      name: data?.name as string | undefined,
      phone: data?.phone as string | undefined,
    }))

    return formatedData;
  }

  async sendMany(message: string, phones: string[]) {
    const promises = phones.map((phone) => this.sendOne(phone, message))
    await Promise.all(promises);
  }

  async sendOne(phoneNumber: string, message: string): Promise<void> {
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    try {
      // const data = await this.awsService.sns.publish(params).promise();
      console.log(`Message sent to ${phoneNumber}:`, message);
    } catch (error) {
      console.error(`Error sending message to ${phoneNumber}:`, error);
      throw error;
    }
  }
}
