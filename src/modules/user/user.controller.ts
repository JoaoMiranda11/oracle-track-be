import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { RequestUser } from 'src/decorators/requestUser.decorator';
import { JwtUserInfo } from '../auth/auth.types';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async update(
    @Query('email') email: string,
    @Query('password') password: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.authService.getAuthenticatedUser(email, password);
    const updatedUser = await this.userService.updateOne(
      user._id as unknown as string,
      updateUserDto,
    );
    return updatedUser;
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }
}
