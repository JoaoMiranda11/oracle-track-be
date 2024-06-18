import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { OtpDto } from './dto/otp.dto';
import { SigninValidator } from './dto/signin.validator';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { AuthenticatedRequest } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('live')
  @UseGuards(JwtAuthGuard)
  async userInfo(@Request() req: AuthenticatedRequest) {
    const userInfo = {
      _id: req.user._id,
      email: req.user.email,
      status: req.user.status,
      role: req.user.role,
    }
    return userInfo;
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('signin')
  async signin(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    const validCredentials = SigninValidator.safeParse({ email, password });
    if (validCredentials.error) {
      throw new HttpException(validCredentials.error.errors, HttpStatus.UNAUTHORIZED);
    }
    return await this.authService.signin(
      validCredentials.data.email,
      validCredentials.data.password,
    );
  }

  @Post('otp')
  async otp(@Body() otpDto: OtpDto) {
    return await this.authService.otp(otpDto.email, otpDto.otp, otpDto.hash);
  }
}
