import { User } from 'src/auth/entity/user.entity';

export interface SaveAlarmDTO {
  user: User;
  hour: number;
  minute: number;
  is_enabled?: boolean;
  name: string;
  count: number;
}

export interface CreateAlarmDTO {
  targetId: number;
  hour: number;
  minute: number;
  name: string;
  count: number;
  itemSeq: string;
  imgage_url: string;
}
