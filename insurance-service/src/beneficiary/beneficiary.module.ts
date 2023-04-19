import { Module } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Beneficiary, BeneficiarySchema } from './beneficiary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Beneficiary.name, schema: BeneficiarySchema }])],
  providers: [BeneficiaryService],
  controllers: [BeneficiaryController],
})
export class BeneficiaryModule {}