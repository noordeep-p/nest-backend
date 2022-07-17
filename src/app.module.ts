import { Module } from '@nestjs/common';
import { Authmodule } from './auth/auth.module';

@Module({
  imports: [Authmodule],
})
export class AppModule {}
