import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import UpdateUserDto from './dtos/UpdateUser.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  public constructor(private userService: UserService) {}

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  public async find(@Req() request) {
    const user = request.user;
    return {
      id: user.sub,
      username: user.name,
      firstName: user.name,
      lastName: user.name,
      email: user.email,
      isConfirmed: user.email_verified,
    };
  }

  @Patch('user')
  @UseGuards(AuthGuard('jwt'))
  public async update(@Body() updateUserDto: UpdateUserDto, @Req() request) {
    const user = request.user;
    return await this.userService.updateUserDetails(user.email, updateUserDto);
  }
}
