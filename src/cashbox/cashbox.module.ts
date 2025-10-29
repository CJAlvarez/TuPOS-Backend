import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cashbox } from '../entities/cashbox.entity';
import { CashboxService } from './cashbox.service';
import { CashboxController } from './cashbox.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Cashbox, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [CashboxController],
  providers: [CashboxService],
  exports: [CashboxService],
})
export class CashboxModule {}