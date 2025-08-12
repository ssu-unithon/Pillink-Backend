import { Max, Min } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.alarms)
  user: User;

  @Column()
  name: string;

  @Column()
  @Min(0)
  @Max(23)
  hour: number;

  @Column()
  @Min(0)
  @Max(59)
  minute: number;

  @Column({ default: true })
  is_enabled: boolean;
}
