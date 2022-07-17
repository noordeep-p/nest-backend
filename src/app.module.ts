import { Module } from '@nestjs/common';
import { Authmodule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [Authmodule, UserModule, SearchModule, CollectionModule],
})
export class AppModule {}
