import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entity/user.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/guards/roles/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, Connections.main) private userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateOne(id: string, newData: UpdateUserDto) : Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await user.updateOne(newData);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      name,
      email,
      passwordHash: hashedPassword,
      role: Role.User,
    });
    return newUser.save();
  }
}
