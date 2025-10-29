import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from '../entities/invoice.entity';
import { Admin } from '../entities/admin.entity';
import { InvoiceConfig } from 'src/entities/invoice-config.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Invoice, InvoiceConfig, Admin]),
    UtilsModule,
    AuthModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
