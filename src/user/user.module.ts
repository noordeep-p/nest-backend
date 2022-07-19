import { Module } from '@nestjs/common';
import { UserConfig } from './user.config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserConfig],
})
export class UserModule {}
