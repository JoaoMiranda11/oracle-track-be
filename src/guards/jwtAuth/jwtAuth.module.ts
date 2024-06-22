import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export const ExpirationJwt = 3600000 * 12

export const JwtAuthModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_KEY'),
    signOptions: { expiresIn: ExpirationJwt },
  }),
});
