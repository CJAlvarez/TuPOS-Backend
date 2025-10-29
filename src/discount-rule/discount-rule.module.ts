import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DiscountRule } from '../entities/discount-rule.entity';
import { DiscountRuleService } from './discount-rule.service';
import { DiscountRuleController } from './discount-rule.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([DiscountRule, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [DiscountRuleController],
  providers: [DiscountRuleService],
  exports: [DiscountRuleService],
})
export class DiscountRuleModule {}