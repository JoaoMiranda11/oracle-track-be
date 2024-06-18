import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../guards/jwtAuth/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtAuthModule } from 'src/guards/jwtAuth/jwtAuth.module';

@Module({
  imports: [
    PassportModule,
    JwtAuthModule,
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
