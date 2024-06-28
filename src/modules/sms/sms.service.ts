import { Injectable } from '@nestjs/common';
import * as Papa from 'papaparse';
@Injectable()
export class SmsService {
  constructor() {}

  async processCSV(file: Express.Multer.File) {
    const fileContent = file.buffer.toString('utf-8');

    const results = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (parsedResults) => {
        console.log('Parsed CSV:', parsedResults.data);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });

    return results;
  }

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    try {
      // const data = await this.awsService.sns.publish(params).promise();
      console.log(`Message sent to ${phoneNumber}:`);
    } catch (error) {
      console.error(`Error sending message to ${phoneNumber}:`, error);
      throw error;
    }
  }
}
