import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import CollectionEntity from './collection.entity';

@Entity({ name: 'collection_element' })
export default class CollectionElement {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'work_id', type: 'text' })
  work_id: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @ManyToOne(() => CollectionEntity, (collection) => collection.elements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionEntity;
}
