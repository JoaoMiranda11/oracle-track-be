// auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const matchPass = await bcrypt.compare(pass, user.passwordHash);
    if (!matchPass) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const { passwordHash, ...result } = user;
    return this.jwtService.sign(result);
  }

  async signup(userInfo: CreateUserDto) {
    return await this.userService.create({
      ...userInfo,
    });
  }
}
