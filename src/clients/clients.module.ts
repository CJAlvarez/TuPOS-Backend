import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UtilsModule } from 'src/utils/utils.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Client, User, Profile, Admin]),
    UtilsModule,
    AuthModule,
    JobsModule
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
