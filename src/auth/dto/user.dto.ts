/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';
import { Disease, Provider, Role } from '../entity/user.entity';
import { Family } from 'src/family/entity/family.entity';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  provider: Provider;
  @IsNotEmpty()
  role: Role;
  @IsNotEmpty()
  diseases: Disease[];
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
