import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatalogVersion } from '../entities/catalog-version.entity';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [SequelizeModule.forFeature([CatalogVersion, Admin]), AuthModule],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
