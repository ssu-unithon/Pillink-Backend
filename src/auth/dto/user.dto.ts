/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';
import { Provider } from '../entity/user.entity';
import { Family } from 'src/family/entity/family.entity';
export class CreateUserDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  provider: Provider;
}

export interface UpdateUserDTO {
  name?: string;
  family?: Family;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface OAuthDTO {
  email: string;
  name: string;
  provider: Provider;
}
