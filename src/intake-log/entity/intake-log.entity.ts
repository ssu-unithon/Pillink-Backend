import { User } from 'src/auth/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export type ALARM_CONFIRM = { alarmId: number; is_checked: boolean };

@Entity()
export class IntakeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: number;

  @Column()
  date: number;

  @ManyToOne(() => User, (user) => user.intake_logs)
  user: User;

  @Column({ default: false })
  is_checked: boolean;

  @Column('simple-json')
  alarm_confirms: ALARM_CONFIRM[];
}
