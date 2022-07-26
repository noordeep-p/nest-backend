import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { CollectionModule } from './collection/collection.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import Collection from './collection/entities/collection.entity';
import CollectionElement from './collection/entities/collectionElement.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SearchModule,
    CollectionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Collection, CollectionElement],
      synchronize: false,
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
