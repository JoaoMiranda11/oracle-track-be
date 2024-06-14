import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connections } from './connections.enum';

export const DbConnections = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('DATABASE_CONNECTION_STRING_1'),
    }),
    inject: [ConfigService],
    connectionName: Connections.main,
  }),
];
