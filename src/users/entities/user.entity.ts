import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role, RoleType } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, {
    eager: true, // roles will be automatically loaded with the user
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  // Helper method to check if user has specific role
  hasRole(roleType: RoleType): boolean {
    return this.roles.some((role) => role.name === roleType);
  }

  // Helper method to get all permissions
  getAllPermissions(): string[] {
    const allPermissions = new Set<string>();
    this.roles.forEach((role) => {
      role.permissions?.forEach((permission) => {
        allPermissions.add(permission);
      });
    });
    return Array.from(allPermissions);
  }
}
