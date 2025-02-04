import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WidgetLayout } from './widget-layout.entity';
import { WidgetRelation } from './widget-relation.entity';
import GraphQLJSON from 'graphql-type-json';

export enum WidgetType {
  BUTTON = 'BUTTON',
  INPUT = 'INPUT',
  FORM = 'FORM',
  // 추가 위젯 타입들...
}

@ObjectType()
@Entity('widgets')
export class Widget {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: WidgetType,
  })
  type: WidgetType;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', default: null, nullable: true })
  props?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', default: null, nullable: true })
  rules?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', default: null, nullable: true })
  style?: Record<string, any>;

  @Field(() => Number)
  @Column({ default: 1 })
  revision: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [WidgetLayout], { nullable: true })
  @OneToMany(() => WidgetLayout, (widgetLayout) => widgetLayout.widget, {
    cascade: true,
  })
  layoutRelations: WidgetLayout[];

  @Field(() => [WidgetRelation], { nullable: true })
  @OneToMany(() => WidgetRelation, (relation) => relation.parentWidget, {
    cascade: true,
  })
  childRelations: WidgetRelation[];

  @Field(() => [WidgetRelation], { nullable: true })
  @OneToMany(() => WidgetRelation, (relation) => relation.childWidget, {
    cascade: true,
  })
  parentRelations: WidgetRelation[];
}
