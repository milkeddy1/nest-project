import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 檢查有沒有重複名稱
  async create(category: string) {
    try {
      const existsCategory = await this.prismaService.categories.findUnique({
        where: {
          name: category,
        },
      });

      if (existsCategory) {
        throw new ConflictException('Category already exists');
      }

      return this.prismaService.categories.create({
        data: {
          name: category,
        },
      });
    } catch (error) {
      // 處理其他可能的錯誤
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll() {
    // 嘗試從 cache 取得資料
    console.log('get..');

    const cachedData = await this.cacheManager.get<any>('categories');
    if (cachedData) {
      console.log('Returning from cache');
      return cachedData;
    }

    const freshData = await this.prismaService.categories.findMany();

    // 將資料存入 cache, 60 秒後過期
    await this.cacheManager.set('categories', freshData, 60000);

    return freshData;
  }
}
