import { Connections } from 'src/libs/mongoose/connections.enum';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from './entity/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      Connections.main,
    ),
  ],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
