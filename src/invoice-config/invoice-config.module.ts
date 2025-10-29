import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvoiceConfig } from '../entities/invoice-config.entity';
import { Admin } from '../entities/admin.entity';
import { InvoiceConfigController } from './invoice-config.controller';
import { InvoiceConfigService } from './invoice-config.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([InvoiceConfig, Admin]), AuthModule],
  controllers: [InvoiceConfigController],
  providers: [InvoiceConfigService],
})
export class InvoiceConfigModule {}
