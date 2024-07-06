import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as Papa from 'papaparse';
import { SmsMessage } from './entity/smsMessage.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Model, ObjectId } from 'mongoose';
import { SmsBatch } from './entity/smsBatch.schema';
import { MessageStatus, SmsProvider } from './sms.enum';
import { Delay } from 'src/utils/common';

interface MessageRes {
  phone: string;
  status: MessageStatus;
}

type MessageEvFn = (
  res: MessageRes & {
    index: number;
  },
) => void;

@Injectable()
export class SmsService {
  constructor(
    @InjectModel(SmsMessage.name, Connections.main)
    private readonly smsMessageModel: Model<SmsMessage>,
    @InjectModel(SmsBatch.name, Connections.main)
    private readonly smsBatchModel: Model<SmsBatch>,
  ) {}

  async processCSV(file: Express.Multer.File) {
    const fileContent = file.buffer.toString('utf-8');

    const results = Papa.parse<any>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    const formatedData = results.data.map((data) => {
      const phone = data?.phone as string | undefined;
      if (phone) delete data.phone;
      return {
        phone,
        metadata: data as any,
      };
    });

    return formatedData;
  }

  private async createBatch(
    userId: string | ObjectId,
    provider: SmsProvider,
    message: string,
    metadata?: any,
  ) {
    const batch = await this.smsBatchModel.create({
      message,
      metadata,
      provider,
      userId,
    });

    return batch;
  }

  populatePlaceholders(message: string, placeholders: any) {
    // TODO: logic to populate by placeholders
    return message;
  }

  private async sendMessage(
    batchId: string | ObjectId,
    phoneNumber: string,
    message: string,
  ): Promise<{ phone: string; status: MessageStatus }> {
    const result = {
      phone: phoneNumber,
      status: MessageStatus.FAILED,
    };
    try {
      const res = await this.mockDisparoPro();
      await this.smsMessageModel.create({
        metadata: res.metadata,
        phone: phoneNumber,
        smsBatchId: batchId,
        status: res.status,
      });
      result.status = res.status;
    } catch (error) {
      console.error(`Error sending message to ${phoneNumber}:`, error);
    }
    return result;
  }

  async sendMany(
    userId: string | ObjectId,
    message: string,
    phones: string[],
    metadata?: any,
    on?: {
      every: MessageEvFn;
      debounce: number;
    },
  ) {
    const batch = await this.createBatch(
      userId,
      SmsProvider.DISPARO_PRO,
      message,
    );
    let count = 0;
    const debounce = on?.debounce ?? 0;
    const promises = phones.map((phone) => {
      const promise = async () => {
        const formatedMsg = this.populatePlaceholders(message, metadata);
        const res = await this.sendMessage(
          batch._id as any,
          phone,
          formatedMsg,
        );
        count++;
        if (debounce && count % debounce === 0) {
          on?.every?.({ ...res, index: count });
        }
        return res;
      };
      return promise();
    });
    return await Promise.all(promises);
  }

  async mockDisparoPro() {
    await Delay(2500);
    return {
      metadata: {},
      status: MessageStatus.SENT,
    };
  }

  async sendOne(
    userId: string | ObjectId,
    phoneNumber: string,
    message: string,
  ): Promise<MessageRes> {
    const result = {
      phone: phoneNumber,
      status: MessageStatus.FAILED,
    };
    const batch = await this.createBatch(
      userId,
      SmsProvider.DISPARO_PRO,
      message,
    );
    try {
      const res = await this.mockDisparoPro();
      await this.smsMessageModel.create({
        metadata: res.metadata,
        phone: phoneNumber,
        smsBatchId: batch._id,
        status: res.status,
      });
      result.status = res.status;
    } catch (error) {
      console.error(
        `[BATCH: ${batch._id}] Error sending message to ${phoneNumber}:`,
        error,
      );
    }
    return result;
  }
}
