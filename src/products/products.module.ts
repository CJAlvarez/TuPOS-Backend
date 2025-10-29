import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
