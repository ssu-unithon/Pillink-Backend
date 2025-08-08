import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entity/family.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Family]), AuthModule],
  providers: [FamilyService],
  controllers: [FamilyController],
  exports: [FamilyService],
})
export class FamilyModule {}
