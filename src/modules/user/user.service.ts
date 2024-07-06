import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  Connection,
  Model,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { User, UserDocument } from './entity/user.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/guards/roles/roles.enum';
import {
  QueryOptions,
  QueryFindOptions,
  QueryProjection,
} from 'src/utils/aux.types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, Connections.main)
    private readonly userModel: Model<User>,
    @InjectConnection(Connections.main) private readonly connection: Connection,
  ) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string, options?: QueryFindOptions<User>) {
    const user = options?.session
      ? await this.userModel
          .findOne({ email }, options?.project)
          .session(options.session)
          .lean()
      : await this.userModel.findOne({ email }, options?.project).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneAndUpdate(
    id: string,
    newData: UpdateQuery<User>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    const findCb = this.userModel.findById;
    const session = options?.session;
    const user = session ? await findCb(id).session(session) : await findCb(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (session)
      return await user.updateOne({ _id: id }, newData).session(session);
    return await user.updateOne({ _id: id }, newData);
  }

  async updateOne(
    id: string,
    newData: UpdateQuery<User>,
    options?: QueryOptions,
  ) {
    if (options?.session)
      return await this.userModel
        .updateOne({ _id: id }, newData)
        .session(options.session);
    return await this.userModel.updateOne({ _id: id }, newData);
  }

  async findOne(id: string, options?: QueryFindOptions<User>) {
    let project: QueryProjection<User & { _id: any }>;
    if (options?.project) {
      project = { _id: 1, ...options.project };
    }
    if (options?.session)
      return await this.userModel
        .findById(id, project)
        .session(options.session)
        .lean();
    return this.userModel.findById(id, project).lean();
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
