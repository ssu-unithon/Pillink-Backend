import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  async findByUID(userId: number): Promise<Family> {
    const user = await this.userService.getById(userId);
    if (!user.family) throw new BadRequestException('소속된 가족이 없습니다');
    const family = await this.findOne({ id: user.family.id });
    if (!family) throw new BadRequestException('소속된 가족이 없습니다');
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
    this.logger.log(`${user.email} 새로운 가족 생성`);
    await this.userService.update(user.id, { family });
    return family;
  }

  async leave(userId: number) {
    const user = await this.userService.getById(userId);
    if (!user.family) throw new BadRequestException('소속된 가족이 없습니다');
    const family = await this.findOne({ id: user.family.id });
    if (!family) throw new BadRequestException('소속된 가족이 없습니다');

    family.users = family.users.filter((u) => u.id !== user.id);

    user.family = null;
    await this.userService.save(user);
    console.log(user);
    this.logger.log(`${user.email} '${family.name}' 탈퇴`);
    if (family.users.length == 0)
      // 사용자가 남아 있지 않으면 제거
      return await this.repo.remove(family);
    if (family.manager.id == user.id)
      // 나간 사람이 관리자 였다면, 다른 사람을 관리자로 임명
      family.manager = family.users[0];
    console.log(family);
    return await this.repo.save(family);
  }

  async insert(userId: number, targetUserId: number) {
    const family = await this.findByUID(userId);
    const targetUser = await this.userService.findOne({ id: targetUserId });
    if (!targetUser)
      throw new BadRequestException('초대할 사용자의 정보가 존재하지 않습니다');
    family.users.push(targetUser);
    return this.repo.save(family);
  }
}
