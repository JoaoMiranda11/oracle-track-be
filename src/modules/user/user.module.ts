import { Connections } from 'src/libs/mongoose/connections.enum';
import { UserService } from './user.service';
import { Module, forwardRef } from '@nestjs/common';
import { User, UserSchema } from './entity/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      Connections.main,
    ),
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
