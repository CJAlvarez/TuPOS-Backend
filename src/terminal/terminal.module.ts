import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Terminal } from '../entities/terminal.entity';
import { TerminalService } from './terminal.service';
import { TerminalController } from './terminal.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Terminal, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [TerminalController],
  providers: [TerminalService],
  exports: [TerminalService],
})
export class TerminalModule {}
