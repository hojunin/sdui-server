import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenusResolver } from './menus.resolver';
import { MenusService } from './menus.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), AuthModule],
  providers: [MenusResolver, MenusService],
  exports: [MenusService],
})
export class MenusModule {}
