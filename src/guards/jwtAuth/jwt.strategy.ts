import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtUserInfo } from '../../modules/auth/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req: any) => {
        if (!req || !req.cookies) return null;
        const token = req.cookies[configService.get<string>('TOKEN_NAME')];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_KEY'),
    });
  }

  async validate(payload: JwtUserInfo) {
    return {
      _id: payload._id,
      email: payload.email,
      role: payload.role,
      status: payload.status,
    };
  }
}
