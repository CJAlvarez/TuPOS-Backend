import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Client, Profile, Admin]),
    AuthModule,
    UtilsModule,
    JobsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
