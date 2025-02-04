import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Widget } from './widget.entity';
import { Layout } from '../../layouts/entities/layout.entity';

@ObjectType()
@Entity('widget_layout')
export class WidgetLayout {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  widgetId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  layoutId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  sectionName: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  order: number;

  @Field(() => Widget)
  @ManyToOne(() => Widget, (widget) => widget.layoutRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'widgetId', referencedColumnName: 'id' })
  widget: Widget;

  @Field(() => Layout, { nullable: true })
  @ManyToOne(() => Layout, (layout) => layout.widgetRelations, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'layoutId', referencedColumnName: 'id' })
  layout: Layout;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
