import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoleType {
  // 일반 역할
  INTERNAL_STAFF = 'INTERNAL_STAFF',
  PARTNER_STAFF = 'PARTNER_STAFF',
  GENERAL_ADMIN = 'GENERAL_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',

  // 도메인별 관리자 역할
  PRODUCT_ADMIN = 'PRODUCT_ADMIN',
  AUTHENTICATION_ADMIN = 'AUTHENTICATION_ADMIN',
  SETTLEMENT_ADMIN = 'SETTLEMENT_ADMIN',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleType,
    unique: true,
  })
  name: RoleType;

  @Column('simple-array', { nullable: true })
  permissions: string[];

  @Column({ nullable: true })
  domain?: string; // 도메인 구분을 위한 필드 추가

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
