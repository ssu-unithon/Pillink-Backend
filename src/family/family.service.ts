import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Family } from './entity/family.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/auth/user.service';

const relations = ['users', 'manager'];

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private repo: Repository<Family>,
    private userService: UserService,
  ) {}
  private readonly logger = new Logger('Family');

  async findOne(where: import('typeorm').FindOptionsWhere<Family>) {
    return await this.repo.findOne({ where, relations });
  }

  /** 소속된 가족이 없으면 throw */
  async findByUID(userId: number): Promise<Family> {
    const user = await this.userService.getById(userId);
    if (!user.family)
      throw new BadRequestException('소속된 가족 그룹이 없습니다');
    const family = await this.findOne({ id: user.family.id });
    if (!family) throw new BadRequestException('소속된 가족 그룹이 없습니다');
    return family;
  }

  async create(userId: number): Promise<Family> {
    const user = await this.userService.getById(userId);
    if (user.family)
      throw new BadRequestException(
        `이미 '${user.family.name}'에 소속되어 있습니다.`,
      );

    const family = await this.repo.save({
      name: `${user.name}의 가족`,
      manager: user,
      users: [user],
    });
    this.logger.verbose(`${user.phone} 새로운 가족 생성`);
    await this.userService.update(user.id, { family });
    return family;
  }

  async leave(userId: number) {
    const user = await this.userService.getById(userId);
    if (!user.family)
      throw new BadRequestException('소속된 가족 그룹이 없습니다');
    const family = await this.findOne({ id: user.family.id });
    if (!family) throw new BadRequestException('소속된 가족 그룹이 없습니다');

    family.users = family.users.filter((u) => u.id !== user.id);

    user.family = null;
    await this.userService.save(user);
    this.logger.verbose(`${user.phone} '${family.name}' 탈퇴`);
    if (family.users.length == 0) {
      // 사용자가 남아 있지 않으면 삭제
      this.logger.verbose(`'${family.name}' 삭제`);
      return await this.repo.remove(family);
    }
    if (family.manager.id == user.id)
      // 나간 사람이 관리자 였다면, 다른 사람을 관리자로 임명
      family.manager = family.users[0];
    return await this.repo.save(family);
  }

  async insert(userId: number, targetPhone: string) {
    const family = await this.findByUID(userId);
    const targetUser = await this.userService.findOne({ phone: targetPhone });
    if (!targetUser)
      throw new BadRequestException('초대할 사용자의 정보가 존재하지 않습니다');
    if (family.users.some((u) => u.id === targetUser.id))
      throw new BadRequestException(
        '해당 사용자는 이미 같은 그룹에 속해 있습니다',
      );
    family.users.push(targetUser);
    this.logger.verbose(`'${family.name}' ${targetUser.name} 추가`);
    return this.repo.save(family);
  }

  async hasRelationship(
    commanderId: number,
    orderedId: number,
    onlyManager: boolean = true,
  ): Promise<boolean> {
    const commander = await this.userService.getById(commanderId);
    const ordered = await this.userService.getById(orderedId);
    const family = await this.findByUID(commander.id);
    // 조건 1 : 실행자는 권한을 가지고 있는가
    if (onlyManager && commander.role !== '보호자')
      throw new ForbiddenException(
        '가족 관리자만 관리 기능에 접근할 수 있습니다',
      );
    // 조건 2 : 피실행자는 실행자와 가족 관계인가
    if (family.id !== ordered.family?.id)
      throw new BadRequestException(
        '해당 사용자는 같은 그룹에 속하지 않았습니다',
      );
    return true;
  }
}
