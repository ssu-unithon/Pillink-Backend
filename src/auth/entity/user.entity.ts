import { Family } from 'src/family/entity/family.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Provider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: Provider;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ManyToOne(() => Family, (family) => family.users, { nullable: true })
  family: Family | null;
}
