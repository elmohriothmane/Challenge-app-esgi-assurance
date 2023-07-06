import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Visit, VisitSchema} from "../schemas/visit.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
  ],
  providers: [VisitService],
  controllers: [VisitController]
})
export class VisitModule {}
