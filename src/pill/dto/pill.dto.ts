import { User } from 'src/auth/entity/user.entity';

export interface CreatePillDTO {
  id: number;
  user: User;
  itemSeq: string;
  name: string;
  count: number;
}
