import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Store } from './entities/store.entity';
import { StoreTheme } from './entities/store-theme.entity';
import { StoreThemesService } from './store-themes.service';
import { StoreThemesController } from './store-themes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreTheme])],
  controllers: [StoresController, StoreThemesController],
  providers: [StoresService, StoreThemesService],
  exports: [StoresService, StoreThemesService],
})
export class StoresModule {}
