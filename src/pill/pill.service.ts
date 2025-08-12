import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
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

  async insertByItemSeq(
    userId: number,
    itemSeq: string,
    count: number,
  ): Promise<Pill> {
    const user = await this.userService.getById(userId);
    const itemInfo = await this.apiService.findOne(itemSeq);
    // 이미 같은 약이 있디면
    if (user.owned_pills?.some((x) => x.itemSeq === itemSeq))
      throw new BadRequestException('이미 해당 약을 복용하고 있습니다');
    const pill = await this.repo.save({
      user: { id: user.id },
      name: itemInfo?.itemName,
      count,
      itemSeq: itemInfo?.itemSeq,
      is_pined: false,
    });
    if (!user.owned_pills) user.owned_pills = [pill];
    else user.owned_pills.push(pill);
    await this.userService.save(user);
    this.logger.verbose(`${user.name}에게 ${pill.name} 추가`);
    return pill;
  }

  async insertToFamily(
    userId: number,
    targetUserId: number,
    itemSeq: string,
    count: number,
  ) {
    await this.familyService.hasRelationship(userId, targetUserId);
    return await this.insertByItemSeq(targetUserId, itemSeq, count);
  }

  async getOwnedPills(userId: number) {
    const user = await this.userService.getById(userId);
    return user.owned_pills;
  }

  async getFamilyPills(userId: number, targetId: number) {
    const targetUser = await this.userService.getById(targetId);
    const family = await this.familyService.findByUID(userId);
    if (family.id !== targetUser.family?.id)
      throw new ForbiddenException('해당 사용자는 같은 그룹이 아닙니다');
    return targetUser.owned_pills;
  }
}
