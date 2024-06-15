import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { TIMESTAMP_MIN_MS } from 'src/utils/dates';
import { Role } from 'src/guards/roles/roles.enum';
import { User } from '../user/entity/user.schema';

@Injectable()
export class AuthService {
  readonly otpExpirationTimestamp = TIMESTAMP_MIN_MS * 5;
  readonly maxTriesPass = 5;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  generateOtp(length: number = 6): string {
    const otp = uuidv4().replace(/-/g, '').substring(0, length);
    return otp.toUpperCase();
  }

  private generateAuthInfo() {
    const otp = this.generateOtp();
    const dueDate = new Date(Date.now() + this.otpExpirationTimestamp);
    const hash = uuidv4();
    return {
      hash,
      dueDate,
      otp,
      tries: 0,
    };
  }

  private async bruteforceAllert(id: string) {
    console.error(`[SEC_DANG]: Possible bruteforce ${id}`);
  }

  private async triggerInvalidPass(user: User) {
    const tries = (user.auth?.tries ?? 0) + 1;
    if (tries > this.maxTriesPass) {
      await this.bruteforceAllert(user._id as string);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    await this.userService.updateOne(user._id as string, {
      auth: {
        dueDate: null,
        hash: null,
        otp: null,
        tries,
      },
    });
  }

  private async testPassword(user: User, pass) {
    const matchPass = await bcrypt.compare(pass, user.passwordHash);
    if (!matchPass) {
      await this.triggerInvalidPass(user);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  private async createJwt(user: User) {
    const { passwordHash, auth, ...result } = user;
    return this.jwtService.sign(result);
  }

  async signin(
    email: string,
    pass: string,
  ): Promise<{ hash: string; dueDate: Date } | string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.testPassword(user, pass);

    if (user.role === Role.Admin) return await this.createJwt(user);

    const authInfo = this.generateAuthInfo();
    await this.userService.updateOne(user._id as string, {
      auth: authInfo,
    });
    const { hash, dueDate } = authInfo;

    return { hash, dueDate };
  }

  async signup(userInfo: CreateUserDto) {
    return await this.userService.create({
      ...userInfo,
    });
  }

  async otp(email: string, otp: string, hash: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.auth.hash !== hash) {
      await this.triggerInvalidPass(user);
    }
    const now = new Date(Date.now());
    if (user.auth.otp !== otp || user.auth.dueDate < now) {
      throw new HttpException('Wrong OTP or expired!', HttpStatus.UNAUTHORIZED);
    }
    return await this.createJwt(user);
  }
}
