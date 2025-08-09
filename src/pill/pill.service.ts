import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Pill } from './entity/pill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/auth/user.service';
import { PillAPIService } from './pill.api.service';
import { FamilyService } from 'src/family/family.service';

const relations = [];

@Injectable()
export class PillService {
  constructor(
    @InjectRepository(Pill) private repo: Repository<Pill>,
    private userService: UserService,
    private apiService: PillAPIService,
    private familyService: FamilyService,
  ) {}
  private readonly logger = new Logger('Pill');

  async findOne(where: import('typeorm').FindOptionsWhere<Pill>) {
    return await this.repo.findOne({ where, relations });
  }

  async insertByItemSeq(userId: number, itemSeq: string): Promise<Pill> {
    const user = await this.userService.getById(userId);
    const itemInfo = await this.apiService.findOne(itemSeq);
    // 이미 같은 약이 있디면
    if (user.owned_pills?.some((x) => x.itemSeq === itemSeq))
      throw new BadRequestException('이미 해당 약을 복용하고 있습니다');
    const pill = await this.repo.save({
      user,
      name: itemInfo.itemName,
      itemSeq: itemInfo.itemSeq,
    });
    if (!user.owned_pills) user.owned_pills = [pill];
    else user.owned_pills.push(pill);
    this.userService.save(user);
    return pill;
  }

  async insertToFamily(userId: number, targetUserId: number, itemSeq: string) {
    await this.familyService.hasRelationship(userId, targetUserId);
    return await this.insertByItemSeq(targetUserId, itemSeq);
  }
}
