import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { OtpDto } from './dto/otp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return await this.authService.signup(createUserDto);
    }

    @Post('signin')
    async signin(@Body() loginDto: LoginDto) {
        return await this.authService.signin(loginDto.email, loginDto.password);
    }

    @Post('otp')
    async otp(@Body() otpDto: OtpDto) {
        return await this.authService.otp(otpDto.email, otpDto.otp, otpDto.hash);
    }
}
