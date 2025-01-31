import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@ObjectType()
@Entity()
@Tree('closure-table')
export class Menu {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  label: string;

  @Field()
  @Column()
  path: string;

  @Field(() => Int)
  @Column({ default: 0 })
  order: number;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Int)
  @Column({ default: 0 })
  depth: number;

  @Field(() => Menu, { nullable: true })
  @TreeParent()
  parent: Menu;

  @Field(() => [Menu], { nullable: true })
  @TreeChildren()
  children: Menu[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
