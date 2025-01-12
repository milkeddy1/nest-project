import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostHello } from './dto/post.hello.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello(@Body(new ValidationPipe()) PostHelloDto: CreatePostHello) {
    return PostHelloDto;
  }
}
