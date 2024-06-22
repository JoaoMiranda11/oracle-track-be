import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { TIMESTAMP_MIN_MS } from 'src/utils/dates';
import { hotp } from 'otplib';
import { UserDocument } from '../user/entity/user.schema';
import { UserStatus } from '../user/user.enum';
import { ConfigService } from '@nestjs/config';
import { OtpDto } from './dto/otp.dto';

@Injectable()
export class AuthService {
  readonly otpExpirationTimestamp = TIMESTAMP_MIN_MS * 5;
  readonly maxTriesPass = 5;
  private readonly otpSalts = 19;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateAuthInfo(requestInfos: { ip: string; userAgent: string }) {
    const hash = uuidv4();
    const otp = hotp.generate(hash, this.otpSalts);
    const dueDate = new Date(Date.now() + this.otpExpirationTimestamp);
    console.log(`[OTP]: ${otp}`);
    return {
      hash,
      dueDate,
      tries: 0,
      ip: requestInfos.ip,
      userAgent: requestInfos.userAgent,
    };
  }

  private async bruteforceAllert(id: string) {
    // TODO: trigger email notify
    console.error(`[SEC_DANG]: Possible bruteforce ${id}`);
  }

  private async triggerInvalidPass(user: UserDocument) {
    const tries = (user.auth?.tries ?? 0) + 1;
    if (tries > this.maxTriesPass) {
      await this.bruteforceAllert(user._id as unknown as string);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const status =
      tries === this.maxTriesPass ? {} : { status: UserStatus.Blocked };
    await this.userService.updateOne(user._id as unknown as string, {
      ...status,
      auth: {
        dueDate: null,
        hash: null,
        otp: null,
        tries,
      },
    });
  }

  private async testPassword(user: UserDocument, pass: string) {
    const matchPass = await bcrypt.compare(pass, user.passwordHash);
    if (!matchPass) {
      await this.triggerInvalidPass(user);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  private async createJwt(user: UserDocument) {
    return this.jwtService.sign({
      _id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  }

  async getAuthenticatedUser(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.testPassword(user, pass);
    return user;
  }

  async signin(
    userInfo: { email: string; pass: string },
    requestInfo: { ip: string; userAgent: string },
  ): Promise<Date> {
    const user = await this.getAuthenticatedUser(userInfo.email, userInfo.pass);

    const authInfo = this.generateAuthInfo(requestInfo);
    await this.userService.updateOne(user._id as unknown as string, {
      auth: authInfo,
    });
    const { dueDate } = authInfo;

    return dueDate;
  }

  async signup(userInfo: CreateUserDto) {
    return await this.userService.create({
      ...userInfo,
    });
  }

  async otp(
    { email, otp }: OtpDto,
    reqInfo: { ip: string; userAgent: string },
  ): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.auth.userAgent !== reqInfo.userAgent) {
      await this.triggerInvalidPass(user);
    }
    if (user.auth.ip !== reqInfo.ip) {
      await this.triggerInvalidPass(user);
    }
    const now = new Date(Date.now());
    if (user.auth.dueDate < now) {
      throw new HttpException('Expired!', HttpStatus.UNAUTHORIZED);
    }
    const validOtp = hotp.check(otp, user.auth.hash, this.otpSalts);
    if (!validOtp) {
      throw new HttpException('Wrong OTP!', HttpStatus.UNAUTHORIZED);
    }
    return await this.createJwt(user);
  }
}
