import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  Connection,
  Model,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { Connections } from 'src/libs/mongoose/connections.enum';

import { UserService } from '../user/user.service';
import { WebsocketService } from '../websocket/websocket.service';
import { WsEventsServer } from '../websocket/websocket.enum';

@Injectable()
export class CreditsService {
  constructor(
    @InjectConnection(Connections.main) private readonly connection: Connection,
    private readonly userService: UserService,
    private readonly websocketService: WebsocketService,
  ) {}

  async getCredits(userId: string) {
    const res = await this.userService.findOne(userId, {
      project: { credits: 1 },
    });
    return res?.credits ?? 0;
  }

  async addUserCredits(userId: string, credits: number): Promise<number> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();
    try {
      const user = await this.userService.findOne(userId, { session });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newCredits = user.credits + credits;
      const _updtResult = await this.userService.updateOne(
        userId,
        { credits: newCredits },
        { session },
      );

      await session.commitTransaction();
      session.endSession();
      this.websocketService.emitToUser(userId, WsEventsServer.UPDATE_CREDITS, {
        msg: 'Novo saldo',
        metadata: newCredits,
      });

      return newCredits;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      throw new HttpException(
        'Error updating user credits',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
