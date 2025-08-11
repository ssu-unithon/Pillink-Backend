import { Alarm } from 'src/alarm/entity/alarm.entity';
import { ChatMessage } from 'src/chat/entity/ChatMessage.entity';
import { Family } from 'src/family/entity/family.entity';
import { IntakeLog } from 'src/intake-log/entity/intake-log.entity';
import { Pill } from 'src/pill/entity/pill.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  OPER = '보호자',
  ARGU = '보호 대상자',
}

export enum Provider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export type Disease =
  | '당뇨병'
  | '고혈압'
  | '무릎관절증'
  | '만성요통'
  | '만성위염'
  | '시력감퇴'
  | '만성심질환'
  | '알레르기'
  | '전립선 비대증'
  | '치매';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'json', nullable: true })
  diseases: Disease[] | null;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: Provider;

  @Column({ type: 'enum', enum: Role, default: Role.OPER })
  role: Role;

  @ManyToOne(() => Family, (family) => family.users, { nullable: true })
  family: Family | null;

  @OneToMany(() => Pill, (pill) => pill.user, { nullable: true })
  owned_pills: Pill[] | null;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chat_messages: ChatMessage[];

  @OneToMany(() => Alarm, (alarm) => alarm.user)
  alarms: Alarm[];

  @OneToMany(() => IntakeLog, (intake) => intake.user)
  intake_logs: IntakeLog[];
}
