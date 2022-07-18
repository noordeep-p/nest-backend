import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import Collection from './entities/collection.entity';
import CollectionElement from './entities/collectionElement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, CollectionElement])],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [TypeOrmModule],
})
export class CollectionModule {}
