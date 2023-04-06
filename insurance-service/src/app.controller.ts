import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { Logger } from '@nestjs/common';




@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    Logger.log('info')
    return this.appService.getHello();
  }
}
