import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreTheme } from "./entities/store-theme.entity";
import { Store } from "./entities/store.entity";
import { StoreThemesService } from "./store-themes.service";
import { StoreThemesController } from "./store-themes.controller";
import { SiteGeneratorService } from "./site-generator.service";

@Module({
  imports: [TypeOrmModule.forFeature([StoreTheme, Store])],
  controllers: [StoreThemesController],
  providers: [StoreThemesService, SiteGeneratorService],
  exports: [StoreThemesService, SiteGeneratorService],
})
export class StoreThemesModule {}
