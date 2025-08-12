import { User } from 'src/auth/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.owned_pills)
  user: User;

  @Column()
  itemSeq: string;

  @Column()
  name: string;

  @Column()
  count: number;

  @Column({ default: false })
  is_pined: boolean;
}
