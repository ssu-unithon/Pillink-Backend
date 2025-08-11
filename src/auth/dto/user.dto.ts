/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';
import { Disease, Provider } from '../entity/user.entity';
import { Family } from 'src/family/entity/family.entity';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  provider: Provider;
  @IsNotEmpty()
  diseases: Disease[];
}

export interface UpdateUserDTO {
  name?: string;
  family?: Family;
}

export interface LoginUserDTO {
  phone: string;
  password: string;
}

export interface OAuthDTO {
  phone: string;
  name: string;
  provider: Provider;
}
