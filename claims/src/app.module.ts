import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemandModule } from './demand/demand.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {WinstonModule} from "nest-winston";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    DemandModule,
    WinstonModule.forRoot({
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
