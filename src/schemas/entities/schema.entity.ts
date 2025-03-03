import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('schemas')
export class Schema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  zodSchema: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  validationRules: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  uiConfig: {
    inputType: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
    label?: string;
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 