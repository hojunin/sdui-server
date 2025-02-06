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
  ACCORDION = 'ACCORDION',
  ALERT = 'ALERT',
  ALERT_DIALOG = 'ALERT_DIALOG',
  ASPECT_RATIO = 'ASPECT_RATIO',
  AVATAR = 'AVATAR',
  BADGE = 'BADGE',
  BUTTON = 'BUTTON',
  BREADCRUMB = 'BREADCRUMB',
  CALENDAR = 'CALENDAR',
  CARD = 'CARD',
  CAROUSEL = 'CAROUSEL',
  CHECKBOX = 'CHECKBOX',
  COLLAPSIBLE = 'COLLAPSIBLE',
  COMBOBOX = 'COMBOBOX',
  COMMAND = 'COMMAND',
  CONTEXT_MENU = 'CONTEXT_MENU',
  DATA_TABLE = 'DATA_TABLE',
  DATE_PICKER = 'DATE_PICKER',
  DIALOG = 'DIALOG',
  DRAWER = 'DRAWER',
  DROPDOWN_MENU = 'DROPDOWN_MENU',
  FORM = 'FORM',
  HOVER_CARD = 'HOVER_CARD',
  INPUT = 'INPUT',
  LABEL = 'LABEL',
  MENUBAR = 'MENUBAR',
  NAVIGATION_MENU = 'NAVIGATION_MENU',
  POPOVER = 'POPOVER',
  PROGRESS = 'PROGRESS',
  RADIO_GROUP = 'RADIO_GROUP',
  SCROLL_AREA = 'SCROLL_AREA',
  SELECT = 'SELECT',
  SEPARATOR = 'SEPARATOR',
  SHEET = 'SHEET',
  SKELETON = 'SKELETON',
  SLIDER = 'SLIDER',
  SWITCH = 'SWITCH',
  TABLE = 'TABLE',
  TABS = 'TABS',
  TEXTAREA = 'TEXTAREA',
  TOAST = 'TOAST',
  TOGGLE = 'TOGGLE',
  TOOLTIP = 'TOOLTIP',
  CUSTOM = 'CUSTOM', // NOTE : 기정의된 위젯이 없는 경우 사용
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
