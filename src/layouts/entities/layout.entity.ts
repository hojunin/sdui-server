import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WidgetLayout } from '../../widgets/entities/widget-layout.entity';
import { Widget } from '../../widgets/entities/widget.entity';
import GraphQLJSON from 'graphql-type-json';

export enum LayoutSectionType {
  HEADER = 'HEADER',
  SECTION = 'SECTION',
  FOOTER = 'FOOTER',
}

registerEnumType(LayoutSectionType, {
  name: 'LayoutSectionType',
  description: 'The type of layout section',
});

@ObjectType()
export class LayoutSection {
  @Field(() => String)
  name: string;

  @Field(() => LayoutSectionType)
  type: LayoutSectionType;

  @Field(() => Number)
  order: number;

  @Column('simple-array')
  @Field(() => [String])
  widgetTypes: string[];

  @Field(() => [Widget], { nullable: true })
  widgets?: Widget[];

  @Field(() => GraphQLJSON, { nullable: true })
  style?: Record<string, any>;
}

@ObjectType()
@Entity('layout')
export class Layout {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  path: string;

  @Column()
  @Field(() => Number)
  revision: number;

  @Column('jsonb')
  @Field(() => [LayoutSection])
  sections: LayoutSection[];

  @Field(() => [WidgetLayout], { nullable: true })
  @OneToMany(() => WidgetLayout, (widgetLayout) => widgetLayout.layout, {
    cascade: true,
    nullable: true,
  })
  widgetRelations?: WidgetLayout[];

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isTemplate: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  templateName?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  templateDescription?: string;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  baseTemplateId?: string;

  @Column({ default: true })
  @Field(() => Boolean)
  isActive: boolean;
}
