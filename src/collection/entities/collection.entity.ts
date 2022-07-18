import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import CollectionElementEntity from './collectionElement.entity';

@Entity({ name: 'collection' })
export default class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'ownerId', type: 'uuid' })
  ownerId: string;
  @Column({ name: 'title', type: 'text', unique: true })
  title: string;
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;
  @CreateDateColumn({ name: 'created_at' })
  updatedAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  createdAt: Date;
  @OneToMany(() => CollectionElementEntity, (element) => element.collection)
  elements: CollectionElementEntity[];
}
