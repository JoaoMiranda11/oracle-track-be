import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { User, UserDocument } from './entity/user.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/guards/roles/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, Connections.main) private readonly userModel: Model<User>,
    @InjectConnection(Connections.main) private readonly connection: Connection,
  ) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateOne(id: string, newData: UpdateQuery<User>) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const res: UpdateWriteOpResult = await user.updateOne(newData);;
    return res;
  }

  async addUserCredits(userId: string, credits: number): Promise<User> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();
    try {
      const user = await this.userModel.findById(userId).session(session);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.credits += credits;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      throw new HttpException(
        'Error updating user credits',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).lean();
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.userModel.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: Role.User,
    });
    return newUser;
  }
}
