import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import UpdatePasswordDto from './dtos/UpdatePassword.dto';
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

  @Patch('user/:accessToken')
  @UseGuards(AuthGuard('jwt'))
  public async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('accessToken') accessToken: string,
  ) {
    return await this.userService.updateUserDetails(accessToken, updateUserDto);
  }

  @Patch('user/password/:accessToken')
  @UseGuards(AuthGuard('jwt'))
  public async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('accessToken') accessToken: string,
  ) {
    return await this.userService.updateUserPassword(
      accessToken,
      updatePasswordDto,
    );
  }
}
