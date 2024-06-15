import { Body, Controller, Patch, Query } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Patch('update')
  async update(
    @Query('email') email: string,
    @Query('password') password: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.authService.getAuthenticatedUser(email, password);
    const updatedUser = await this.userService.updateOne(
      user._id as string,
      updateUserDto,
    );
    return updatedUser;
  }
}
