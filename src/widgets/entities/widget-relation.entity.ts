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

@ObjectType()
@Entity('widget_relations')
export class WidgetRelation {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  parentWidgetId: string;

  @Field(() => String)
  @Column()
  childWidgetId: string;

  @Field(() => Number)
  @Column()
  order: number;

  @Field(() => Widget)
  @ManyToOne(() => Widget, (widget) => widget.childRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentWidgetId' })
  parentWidget: Widget;

  @Field(() => Widget)
  @ManyToOne(() => Widget, (widget) => widget.parentRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'childWidgetId' })
  childWidget: Widget;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
