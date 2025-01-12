import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from 'src/dto/category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('categories')
@UseGuards(JwtAuthGuard) // 檢查 token 是否正確
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body(new ValidationPipe()) categoryDto: CategoryDto) {
    return this.categoriesService.create(categoryDto.name);
  }

  @Get()
  async getCategories() {
    return this.categoriesService.findAll();
  }
}
