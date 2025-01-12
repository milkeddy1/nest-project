import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CacheModule.register({
      ttl: 60000, // 快取時間 60 秒
    }),
  ],
  controllers: [AppController, CategoriesController],
  providers: [AppService, PrismaService, CategoriesService],
})
export class AppModule {}
