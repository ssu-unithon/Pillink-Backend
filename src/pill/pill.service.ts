import { Injectable, Logger } from '@nestjs/common';
import { Pill } from './entity/pill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const relations = [];

@Injectable()
export class PillService {
  constructor(@InjectRepository(Pill) private repo: Repository<Pill>) {}
  private readonly logger = new Logger('Pill');

  async findOne(where: import('typeorm').FindOptionsWhere<Pill>) {
    return await this.repo.findOne({ where, relations });
  }
}
