import { User } from 'src/auth/entity/user.entity';
import { ItemInfo } from 'src/pill/pill.api.service';

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

export interface ResponseAlarmAPI {
  id: number;
  user: User;
  name: string;
  hour: number;
  minute: number;
  is_enabled: boolean;
  itemSeq: string;
  image_url: string;
  detail: ItemInfo | null;
}
