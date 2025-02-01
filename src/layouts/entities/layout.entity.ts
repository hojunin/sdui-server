import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
export class LayoutStyle {
  @Field(() => String, { nullable: true })
  backgroundColor?: string;

  @Field(() => String, { nullable: true })
  padding?: string;

  @Field(() => String, { nullable: true })
  margin?: string;

  @Field(() => String, { nullable: true })
  width?: string;

  @Field(() => String, { nullable: true })
  height?: string;

  // 기타 스타일 속성들을 추가할 수 있습니다.
}

@ObjectType()
export class LayoutSection {
  @Field(() => String)
  name: string;

  @Field(() => LayoutSectionType)
  type: LayoutSectionType;

  @Field(() => Number)
  order: number;

  @Field(() => [String], { defaultValue: [] })
  children: string[];

  @Field(() => LayoutStyle, { nullable: true })
  style?: LayoutStyle;
}

@ObjectType()
@Entity()
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
