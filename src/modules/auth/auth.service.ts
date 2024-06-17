import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { TIMESTAMP_MIN_MS } from 'src/utils/dates';
import { Role } from 'src/guards/roles/roles.enum';
import { User, UserDocument } from '../user/entity/user.schema';
import { UserStatus } from '../user/user.enum';

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
    email: string,
    pass: string,
  ): Promise<{ hash: string; dueDate: Date } | string> {
    const user = await this.getAuthenticatedUser(email, pass);

    const authInfo = this.generateAuthInfo();
    await this.userService.updateOne(user._id as unknown as string, {
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
